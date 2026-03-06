import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files - serve from current directory since files are in root
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
    }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Status and debugging endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    apiKey: process.env.GEMINI_API_KEY ? '✓ Configured' : '❌ Missing',
    port: PORT
  });
});

// Gemini API endpoint - Backend call to keep API keys secure
app.post('/api/triage', async (req, res) => {
  try {
    const { patientIntake } = req.body;

    if (!patientIntake) {
      return res.status(400).json({ error: 'Patient intake data is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

    const systemPrompt = `You are a clinical triage assistant for City General Hospital. Extract patient data and classify severity.

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

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        role: 'user',
        parts: [{ text: patientIntake }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2000
      }
    };

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return res.status(response.status).json({
        error: `Gemini API error: ${errorData.error?.message || 'Unknown error'}`,
        details: errorData
      });
    }

    const data = await response.json();

    // Extract JSON from response
    let jsonData = null;
    if (data.candidates && data.candidates[0]?.content?.parts) {
      const textContent = data.candidates[0].content.parts
        .filter(part => part.text)
        .map(part => part.text)
        .join('');

      // Remove markdown code fences if present
      const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) ||
                       textContent.match(/```\s*([\s\S]*?)\s*```/) ||
                       textContent.match(/(\{[\s\S]*\})/);

      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[1]);
      } else {
        jsonData = JSON.parse(textContent);
      }
    }

    res.json(jsonData);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server with graceful shutdown
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🏥 MedGuard AI Backend Server            ║
╚════════════════════════════════════════════╝

✓ Server running on: http://0.0.0.0:${PORT}
✓ Environment: ${process.env.NODE_ENV || 'development'}
✓ API Endpoint: POST /api/triage
✓ Health Check: GET /api/health
✓ Frontend: http://localhost:${PORT}

Ready to process patient screening data...
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⏹️ SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});
