# Deployment & Submission Checklist

## Pre-Deployment Verification (10 minutes before deploy)

### ✅ Code Review
- [ ] Firebase API key configured in `firebase.js`
- [ ] Gemini API key configured in `app.js` (using gemini-2.0-pro)
- [ ] No console errors (F12)
- [ ] All files in correct location

### ✅ Functional Testing (Local)
- [ ] Page loads without errors
- [ ] Can paste PT-001 test case
- [ ] "Screen Patient" button works
- [ ] Gemini API returns valid JSON
- [ ] Results display correctly
- [ ] "Submit to Database" button appears
- [ ] Can click submit (requires Firebase)
- [ ] Firestore shows saved record

### ✅ Test All 3 Cases

#### Test 1: PT-001 (CRITICAL)
- [ ] Paste PT-001 text
- [ ] Click "Screen Patient"
- [ ] Verify status = **CRITICAL** (in red box)
- [ ] Click "Submit to Database"
- [ ] Check Firestore console: PT-001 saved with CRITICAL status
- [ ] Dashboard shows red card with PT-001
- [ ] **Screenshot**: Firestore showing PT-001 document

#### Test 2: PT-002 (SAFE)
- [ ] Paste PT-002 text
- [ ] Click "Screen Patient"
- [ ] Verify status = **SAFE** (in green box)
- [ ] Click "Submit to Database"
- [ ] Firestore shows PT-002 with SAFE status
- [ ] Dashboard shows green card

#### Test 3: PT-003 (MODERATE)
- [ ] Paste PT-003 text
- [ ] Click "Screen Patient"
- [ ] Verify status = **MODERATE** (in amber box)
- [ ] Click "Submit to Database"
- [ ] Firestore shows PT-003 with MODERATE status
- [ ] Dashboard shows amber card

### ✅ Dashboard Features
- [ ] Filter buttons work (All/CRITICAL/MODERATE/SAFE)
- [ ] Cards display all fields correctly
- [ ] Color coding correct
- [ ] Real-time update works (new submissions appear instantly)
- [ ] Dashboard responsive on mobile

### ✅ Mobile Testing
- [ ] Open on mobile browser
- [ ] All buttons clickable
- [ ] Textarea scrollable
- [ ] Results panel scrollable
- [ ] Dashboard cards stack properly
- [ ] API calls work on mobile

---

## Deployment Steps (Firebase Hosting)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase Project
```bash
cd medguard-ai
firebase init hosting
```

When prompted:
- Select your project
- Use `dist` or `.` as public directory
- **Say NO to single-page rewrites**

### Step 4: Deploy
```bash
firebase deploy --only hosting
```

### Step 5: Get Live URL
Firebase will show:
```
Hosting URL: https://YOUR_PROJECT_ID.web.app
```

### Step 6: Test Live URL
- [ ] URL loads in browser
- [ ] All 3 test cases work
- [ ] Submits to Firestore
- [ ] Dashboard updates in real-time
- [ ] Mobile works

---

## Firestore Screenshot Preparation

### Before Submission:
1. Open Firestore Console
2. Navigate to `patients` collection
3. Click on PT-001 document
4. Expand to show all fields:
   - patientId: PT-001
   - name: Ravi Shankar
   - symptoms: ["chest pain", "shortness of breath", ...]
   - allergies: ["Penicillin", "Aspirin"]
   - status: **CRITICAL** ← Most important
   - timestamp: visible
5. **Screenshot this** (use Print Screen or built-in screenshot tool)
6. **Save as**: `PT-001-CRITICAL.png` or `firestore-proof.png`

### What Evaluators Look For:
- ✅ PT-001 exists in Firestore
- ✅ patientId field correct
- ✅ All extraction fields present
- ✅ status = "CRITICAL"
- ✅ Server timestamp present

---

## System Prompt for Google Form

**Note**: The system prompt in `app.js` has been updated with:
- Enhanced clarity on extraction rules
- Specific numeric thresholds (BP > 160, SpO2 < 96)
- Explicit JSON-only output requirement
- Case-insensitive symptom matching

Current system prompt (automatically used by app):

```
You are a clinical triage assistant for City General Hospital. Extract patient data and classify severity.

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
- doctorNotes: Any clinical notes from attending physician

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
JSON keys: patientId, name, age, symptoms, allergies, medications, bp, pulse, spo2, doctorNotes, status
```

---

## AI Agent Log - SUBMIT THIS EXACT TEXT

> "Used GitHub Copilot to debug the Gemini API integration by updating the deprecated `gemini-pro` model to `gemini-2.0-flash`, enhanced the system prompt for stricter JSON-only output control with `responseMimeType: application/json`, and optimized the triage classification logic to correctly identify CRITICAL cases (chest pain + high BP + allergies), MODERATE cases (missing vitals), and SAFE cases, while ensuring all patient records save to Firestore with proper type validation."

---

## Google Form Fields to Fill

1. **Team Name**: [Your team name]
2. **Team Members**: [Names separated by comma]
3. **Live URL**: `https://your-project-id.web.app`
4. **System Prompt**: [Copy from section above]
5. **Firestore Screenshot**: [Upload PT-001 proof image]
6. **AI Agent Log**: [One sentence from options above]
7. **Brief Description**: [2-3 sentences about app]

**Example Description**:
> MedGuard AI is a clinical triage system that uses Google Gemini API to extract structured data from unstructured patient intake records. It applies rule-based classification to determine risk levels (CRITICAL/MODERATE/SAFE) and stores all records in Firebase Firestore. The live dashboard displays real-time updates with color-coded cards for each patient status, enabling rapid medical team response to critical cases.

---

## Last-Minute Checklist (5 Minutes Before Submission)

- [ ] Live URL tested and working
- [ ] All 3 test cases showing correct status
- [ ] Firestore screenshot saved
- [ ] System prompt copied to clipboard
- [ ] AI Agent Log written down
- [ ] Description written
- [ ] Form fields ready to paste
- [ ] Browser open with live URL
- [ ] Mobile browser showing working app (optional but impressive)
- [ ] Time until deadline noted

---

## Troubleshooting During Live Event

### "Records not showing in Firestore"
1. Check Firestore Security Rules
2. Copy this:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Paste into Firestore → Rules
4. Publish
5. Try submitting again

### "Gemini API returns error"
1. Check API key in app.js
2. Verify key has Gemini API enabled in Google Cloud
3. Check console (F12) for exact error
4. Try test case with shorter text

### "JSON parse error"
1. Check System Prompt for accuracy
2. Add this to debug:
```javascript
console.log("Raw Gemini response:", response);
```
3. Verify Gemini is returning pure JSON

### "Mobile screen is jumbled"
1. Check viewport meta tag in index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
2. Test in Chrome DevTools mobile view (F12 → Toggle device toolbar)
3. Adjust CSS max-width if needed

### "Dashboard not updating"
1. Check Firestore onSnapshot listener
2. Verify records are actually being saved
3. Refresh page
4. Check browser console for errors

---

## Marking Rubric Reference

| Criterion | Points | What We Check |
|-----------|--------|---------------|
| Data Extraction | 20 | PT-001 in Firestore with all fields |
| CRITICAL Logic | 20 | PT-001 correctly classified |
| MODERATE Logic | 15 | PT-003 correctly classified |
| Live Dashboard | 15 | Real-time updates from Firestore |
| Deployment | 15 | Public URL, mobile-responsive |
| Prompt Quality | 10 | Clear, well-engineered prompt |
| AI Agent Log | 5 | Meaningful sentence |
| **TOTAL** | **100** | |

---

## Post-Submission

- [ ] Form confirmation received
- [ ] Screenshot proof saved locally
- [ ] System prompt saved in file
- [ ] Code committed to GitHub (optional)
- [ ] Deployment URL bookmarked

---

**Remember**: Submit before the 120-minute deadline!

**Good luck! 🚀**
