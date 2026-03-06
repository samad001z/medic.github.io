// MedGuard AI - Main Application Logic

// Configuration
const CONFIG = {
    GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
};

// System Prompt for Gemini - Engineered for precise extraction and classification
const SYSTEM_PROMPT = `You are a clinical triage assistant for City General Hospital. Extract patient data and classify severity.

EXTRACTION TASK:
Parse the patient intake record and extract these fields:
- patientId: Found after "PATIENT ID:" label
- name: Patient's full name
- age: Patient's age as integer, null if missing or marked "?"
- symptoms: Array of reported symptoms from the intake
- allergies: Array of known drug/substance allergies
- medications: Array of current medications with dosage
- bp: Blood pressure as string (e.g., "180/110"), null if missing
- pulse: Heart rate as integer (bpm), null if missing
- spo2: Oxygen saturation as integer (%), null if missing
- doctorNotes: Any clinical notes from attending physician. If no doctor notes found, return "Not Available"

CLASSIFICATION RULES - Apply EXACTLY as written:
1. CRITICAL status if ANY of these conditions are true:
   - "chest pain" appears in symptoms (case-insensitive)
   - "shortness of breath" appears in symptoms (case-insensitive)
   - SpO2 < 96
   - BP systolic (first number) > 160
   - ANY known drug allergy is present (allergies array is not empty)

2. MODERATE status if ANY of these conditions are true:
   - Name is missing or empty
   - Age is missing, null, or marked as "?"
   - Any vital (bp, pulse, spo2) is missing or null

3. Otherwise SAFE status

OUTPUT REQUIREMENT:
Return ONLY valid JSON with no markdown, code fences, or explanation. The JSON must be parseable by JSON.parse().
JSON keys: patientId, name, age, symptoms, allergies, medications, bp, pulse, spo2, doctorNotes, status`;

// Global state
let currentPatientData = null;
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadDashboard();
});

// Event listeners
function initializeEventListeners() {
    const screenBtn = document.getElementById('screenBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    screenBtn.addEventListener('click', handleScreenPatient);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            loadDashboard();
        });
    });
}

// Main handler: Screen Patient
async function handleScreenPatient() {
    const intakeText = document.getElementById('intakeText').value.trim();
    const resultPanel = document.getElementById('resultPanel');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const submitBtn = document.getElementById('submitBtn');
    const screenBtn = document.getElementById('screenBtn');

    // Validation
    if (!intakeText) {
        displayError('Please paste a patient intake record first.');
        return;
    }

    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        displayError('❌ ERROR: Gemini API key not configured. Update CONFIG.GEMINI_API_KEY in app.js');
        return;
    }

    // Show loading state
    screenBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');
    submitBtn.classList.add('hidden');
    resultPanel.innerHTML = '';

    try {
        // Call Gemini API
        const response = await callGeminiAPI(intakeText);
        
        // Parse JSON response
        const patientData = parseJsonResponse(response);
        
        // Validate and enhance with triage classification
        const enhancedData = validateAndClassifyRisk(patientData);
        
        // Store for submission
        currentPatientData = {
            ...enhancedData,
            rawInput: intakeText.trim(),
            timestamp: null // Will be set by Firestore
        };

        // Display results
        displayResults(currentPatientData);
        
        // Show submit button
        submitBtn.classList.remove('hidden');
        
    } catch (error) {
        displayError(`Error: ${error.message}`);
        console.error('Screening error:', error);
    } finally {
        screenBtn.disabled = false;
        loadingSpinner.classList.add('hidden');
    }
}

// Call Gemini API with retry logic
async function callGeminiAPI(intakeText, retryCount = 0) {
    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: `${SYSTEM_PROMPT}\n\nPatient Intake Record:\n${intakeText}`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2000,
            responseMimeType: "application/json"
        }
    };

    try {
        const response = await fetch(`${CONFIG.GEMINI_API_ENDPOINT}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMessage = `Gemini API Error: ${response.status} ${response.statusText}`;
            try {
                const error = await response.json();
                errorMessage = `Gemini API Error: ${error.error?.message || errorMessage}`;
            } catch (e) {
                // Response not JSON, use statusText
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid API response: missing candidates or content structure');
        }
        
        if (!data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            throw new Error('Invalid API response: missing parts');
        }

        const responseText = data.candidates[0].content.parts[0].text;
        if (!responseText) {
            throw new Error('API returned empty response');
        }

        return responseText;

    } catch (error) {
        if (retryCount < CONFIG.MAX_RETRIES) {
            console.log(`Retry ${retryCount + 1}/${CONFIG.MAX_RETRIES} after ${CONFIG.RETRY_DELAY}ms`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
            return callGeminiAPI(intakeText, retryCount + 1);
        }
        throw error;
    }
}

// Parse JSON from response (handles markdown code fences and edge cases)
function parseJsonResponse(responseText) {
    try {
        // Trim whitespace
        const trimmed = responseText.trim();
        
        // Try direct JSON parse first
        return JSON.parse(trimmed);
    } catch (e) {
        try {
            // Try removing markdown code fences if present
            let cleaned = responseText;
            if (cleaned.includes('```json')) {
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (cleaned.includes('```')) {
                cleaned = cleaned.replace(/```\n?/g, '');
            }
            
            // Try extracting JSON object
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0].trim());
            }
        } catch (parseError) {
            // Continue to error below
        }
        
        throw new Error('Failed to parse JSON from API response. Response: ' + responseText.substring(0, 200));
    }
}

// Validate and classify patient risk - ensures proper data types
function validateAndClassifyRisk(data) {
    // Ensure required fields exist with proper types
    const validated = {
        patientId: data?.patientId || `PT-${Math.floor(Math.random() * 10000)}`,
        name: data?.name || null,
        age: (data?.age !== null && data?.age !== undefined && data?.age !== '') ? parseInt(data.age) : null,
        symptoms: Array.isArray(data?.symptoms) ? data.symptoms.filter(s => s && typeof s === 'string') : [],
        allergies: Array.isArray(data?.allergies) ? data.allergies.filter(a => a && typeof a === 'string') : [],
        medications: Array.isArray(data?.medications) ? data.medications.filter(m => m && typeof m === 'string') : [],
        bp: data?.bp || null,
        pulse: (data?.pulse !== null && data?.pulse !== undefined) ? parseInt(data.pulse) : null,
        spo2: (data?.spo2 !== null && data?.spo2 !== undefined) ? parseInt(data.spo2) : null,
        doctorNotes: data?.doctorNotes || 'Not Available',
        status: 'SAFE' // Default, will be overwritten
    };

    // Apply triage classification rules
    validated.status = classifyRisk(validated);

    return validated;
}

// Classification logic - matches prompt rules exactly
function classifyRisk(patient) {
    const { name, age, symptoms, allergies, bp, pulse, spo2 } = patient;

    // CRITICAL: Check for critical indicators
    // Normalize and check symptoms
    const symptomText = (symptoms || []).join(' ').toLowerCase();
    const hasChestPain = symptomText.includes('chest pain');
    const hasShortness = symptomText.includes('shortness of breath');
    
    // Safe SpO2 check
    let lowSpO2 = false;
    if (spo2 !== null && spo2 !== undefined) {
        lowSpO2 = parseInt(spo2) < 96;
    }
    
    // Safe BP parsing
    let highBP = false;
    if (bp !== null && bp !== undefined && typeof bp === 'string') {
        const systolic = parseInt(bp.split('/')[0]);
        if (!isNaN(systolic)) {
            highBP = systolic > 160;
        }
    }
    
    // Check for allergies
    const hasAllergy = allergies && Array.isArray(allergies) && allergies.length > 0;

    if (hasChestPain || hasShortness || lowSpO2 || highBP || hasAllergy) {
        return 'CRITICAL';
    }

    // MODERATE: Check for incomplete/missing data - STRICT checking
    const missingName = !name || name === null || name === '' || name === 'Unknown' || name === 'N/A';
    const missingAge = !age || age === null || age === undefined || age === '?';
    const missingBP = bp === null || bp === undefined;
    const missingPulse = pulse === null || pulse === undefined;
    const missingSpo2 = spo2 === null || spo2 === undefined;

    // If ANY required field is missing → MODERATE
    if (missingName || missingAge || missingBP || missingPulse || missingSpo2) {
        return 'MODERATE';
    }

    // Otherwise SAFE
    return 'SAFE';
}

// Display results in result panel
function displayResults(data) {
    const resultPanel = document.getElementById('resultPanel');
    const statusClass = data.status.toLowerCase();
    
    const html = `
        <div class="result-section">
            <h3 class="${data.status.toLowerCase()}">${data.status === 'CRITICAL' ? '🔴' : data.status === 'MODERATE' ? '🟡' : '🟢'} Status: ${data.status}</h3>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;
    
    resultPanel.innerHTML = html;
}

// Display error message
function displayError(message) {
    const resultPanel = document.getElementById('resultPanel');
    resultPanel.innerHTML = `<p class="error">${message}</p>`;
}

// Submit patient record to Firestore
async function submitPatientRecord() {
    if (!currentPatientData) {
        alert('No patient data to submit');
        return;
    }

    if (!window.firebaseDB) {
        displayError('Firebase not initialized. Check firebase.js configuration.');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Submitting...';

    try {
        const docRef = await window.firebaseDB.db.collection('patients').add({
            ...currentPatientData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert(`✓ Patient record saved with ID: ${docRef.id}`);
        document.getElementById('intakeText').value = '';
        document.getElementById('resultPanel').innerHTML = '<p class="placeholder">Results will appear here</p>';
        submitBtn.classList.add('hidden');
        currentPatientData = null;
        
        // Refresh dashboard
        loadDashboard();

    } catch (error) {
        displayError(`Failed to save: ${error.message}`);
        console.error('Firestore error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Load and display dashboard
function loadDashboard() {
    if (!window.firebaseDB) {
        console.error('Firebase not initialized');
        return;
    }

    const dashboardContainer = document.getElementById('dashboardContainer');

    try {
        // Set up real-time listener
        // Note: Order by timestamp first (single field), then filter in memory
        let query = window.firebaseDB.db.collection('patients').orderBy('timestamp', 'desc');

        // Real-time listener with onSnapshot
        window.unsubscribe = query.onSnapshot(
            (snapshot) => {
                if (snapshot.empty) {
                    dashboardContainer.innerHTML = '<p class="placeholder">No records found. Screen a patient to begin.</p>';
                    return;
                }

                let records = [];
                snapshot.forEach((doc) => {
                    records.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                // Apply status filter in memory if needed
                if (currentFilter !== 'all') {
                    records = records.filter(record => record.status === currentFilter);
                }

                if (records.length === 0) {
                    dashboardContainer.innerHTML = '<p class="placeholder">No records found for the selected filter.</p>';
                    return;
                }

                renderDashboard(records);
            },
            (error) => {
                console.error('Firestore listener error:', error);
                dashboardContainer.innerHTML = `<p class="placeholder">Error loading dashboard: ${error.message}</p>`;
            }
        );

    } catch (error) {
        console.error('Dashboard error:', error);
        dashboardContainer.innerHTML = `<p class="placeholder">Error: ${error.message}</p>`;
    }
}

// Render dashboard cards
function renderDashboard(records) {
    const dashboardContainer = document.getElementById('dashboardContainer');
    
    if (records.length === 0) {
        dashboardContainer.innerHTML = '<p class="placeholder">No records match this filter.</p>';
        return;
    }

    const cardsHTML = records.map(record => createPatientCard(record)).join('');
    dashboardContainer.innerHTML = cardsHTML;
}

// Create individual patient card
function createPatientCard(record) {
    const status = record.status || 'SAFE';
    const statusClass = status.toLowerCase();
    const timestamp = record.timestamp ? new Date(record.timestamp.seconds * 1000).toLocaleString() : 'N/A';
    
    const symptomsHTML = record.symptoms && record.symptoms.length > 0
        ? `<ul class="symptoms-list">${record.symptoms.map(s => `<li>• ${s}</li>`).join('')}</ul>`
        : '<p style="color: #999; font-size: 0.9em;">No symptoms reported</p>';

    return `
        <div class="patient-card ${statusClass}">
            <div class="patient-card-header">
                <div class="patient-id">${record.patientId || 'N/A'}</div>
                <div class="status-badge ${statusClass}">
                    ${status === 'CRITICAL' ? '🔴' : status === 'MODERATE' ? '🟡' : '🟢'}
                    ${status}
                </div>
            </div>
            
            <div class="patient-detail">
                <span class="patient-detail-label">Name:</span>
                <span class="patient-detail-value">${record.name || 'Unknown'}</span>
            </div>
            
            <div class="patient-detail">
                <span class="patient-detail-label">Age:</span>
                <span class="patient-detail-value">${record.age ?? 'Unknown'}</span>
            </div>
            
            <div class="patient-detail">
                <span class="patient-detail-label">BP:</span>
                <span class="patient-detail-value">${record.bp || 'Not recorded'}</span>
            </div>
            
            <div class="patient-detail">
                <span class="patient-detail-label">SpO2:</span>
                <span class="patient-detail-value">${record.spo2 ? record.spo2 + '%' : 'Not recorded'}</span>
            </div>
            
            <div class="patient-detail">
                <span class="patient-detail-label">Pulse:</span>
                <span class="patient-detail-value">${record.pulse ? record.pulse + ' bpm' : 'Not recorded'}</span>
            </div>
            
            <div class="patient-detail">
                <span class="patient-detail-label">Allergies:</span>
                <span class="patient-detail-value">${record.allergies?.length > 0 ? record.allergies.join(', ') : 'None'}</span>
            </div>
            
            <div style="margin-top: 12px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 12px;">
                <span class="patient-detail-label">Symptoms:</span>
                ${symptomsHTML}
            </div>
            
            <div class="patient-detail" style="font-size: 0.85em; color: #999; margin-top: 12px;">
                <strong>Doctor Notes:</strong> ${record.doctorNotes || 'Not Available'}
            </div>
            
            <div class="patient-detail" style="font-size: 0.85em; color: #999; margin-top: 8px;">
                <strong>Recorded:</strong> ${timestamp}
            </div>
        </div>
    `;
}

// Cleanup
window.addEventListener('beforeunload', () => {
    if (window.unsubscribe) {
        window.unsubscribe();
    }
});

console.log('MedGuard AI Application loaded');

