# MedGuard AI - Complete Setup & Deployment Guide

## 📋 Project Overview

**MedGuard AI** is an AI-powered clinical triage system for the AI Innovation Hackathon 2026. It screens unstructured patient intake text, extracts structured data using Google Gemini API, applies triage classification rules, and displays results on a real-time Firebase dashboard.

### Tech Stack
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **AI/LLM**: Google Gemini API
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting (or Vercel/Netlify)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get API Keys

#### 1a. Get Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

#### 1b. Setup Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it "MedGuard AI"
4. Follow the setup wizard
5. Click "Create web app" and copy the configuration

### Step 2: Configure Keys in Code

#### Edit `firebase.js`
Replace this section with your Firebase config:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",  // From Firebase Console
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",  // Your Firebase Project ID
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

How to find these values:
1. Go to Firebase Console → Your Project
2. Click ⚙️ (Settings) → Project Settings
3. Scroll to "Your apps" and click your web app
4. Copy all values into `firebaseConfig`

#### Edit `app.js`
Replace this line:
```javascript
GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY'
```
With your actual Gemini API key:
```javascript
GEMINI_API_KEY: 'sk-...your-key-here...'
```

### Step 3: Setup Firestore

1. Go to Firebase Console → Your Project
2. Click "Firestore Database" → "Create Database"
3. Start in **Test Mode** (for hackathon)
4. Choose region: `asia-south1` (India) or closest to you
5. Click "Enable"

### Step 4: Open & Test Locally

1. Open `index.html` in a web browser
2. Paste test patient data (see below)
3. Click "Screen Patient"
4. Verify results appear and can be submitted
5. Check Firestore Console to see saved records

### Step 5: Deploy to Public URL

Choose one option:

#### Option A: Firebase Hosting (Recommended)
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```
Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

#### Option B: Vercel (Easiest)
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Upload your folder (or connect GitHub)
4. Deploy

#### Option C: Netlify  
1. Go to [Netlify](https://app.netlify.com)
2. Drag and drop your project folder
3. Done!

---

## 🧪 Testing with Sample Data

### Test Case 1: CRITICAL (PT-001)
```
PATIENT ID: PT-001
Name: Ravi Shankar
Age: 58 | Gender: Male
Ward: Emergency
Symptoms: Severe chest pain, shortness of breath, radiating pain to left arm.
Vitals: BP 180/110, Pulse 102, SpO2 94%
Known Allergies: Penicillin, Aspirin
Current Medications: Warfarin 5mg daily
Doctor Notes: Possible acute MI. Rule out STEMI. Do NOT administer aspirin.
```
**Expected**: Status = **CRITICAL** ✓

### Test Case 2: SAFE (PT-002)
```
PATIENT ID: PT-002
Name: Priya Mehta
Age: 29 | Gender: Female
Ward: General OPD
Symptoms: Mild seasonal cough, runny nose for 3 days.
Vitals: BP 118/76, Pulse 72, SpO2 99%
Known Allergies: None
Current Medications: None
Doctor Notes: Likely viral URI. Prescribed antihistamines. Follow up in 5 days if no improvement.
```
**Expected**: Status = **SAFE** ✓

### Test Case 3: MODERATE (PT-003)
```
PATIENT ID: PT-003
Name: [Not Provided]
Age: ? | Gender: Unknown
Ward: ?
Symptoms: Dizziness and some pain.
Vitals: Not recorded.
Known Allergies: Unknown
Current Medications: ?
Doctor Notes: Patient brought in by bystander. Unresponsive on arrival.
```
**Expected**: Status = **MODERATE** ✓

---

## 🔐 Security Notes

### For Hackathon
- APIs keys can be in frontend code (already minimized exposure)
- Firestore is in Test Mode (open access)

### For Production (NOT THIS HACKATHON)
- Move API calls to backend
- Use environment variables
- Enable Firestore Authentication
- Use restrictive security rules

---

## 📊 Firestore Schema

Each patient record is stored as:
```json
{
  "patientId": "PT-001",
  "name": "Ravi Shankar",
  "age": 58,
  "symptoms": ["chest pain", "shortness of breath"],
  "allergies": ["Penicillin", "Aspirin"],
  "medications": ["Warfarin 5mg"],
  "bp": "180/110",
  "pulse": 102,
  "spo2": 94,
  "doctorNotes": "Possible acute MI...",
  "status": "CRITICAL",
  "timestamp": "[Firestore Server Timestamp]",
  "rawInput": "[Original intake text]"
}
```

---

## 🎯 Triage Classification Rules

The app applies these rules (after Gemini extraction):

### CRITICAL if any:
- ✓ Symptoms contain "chest pain"
- ✓ Symptoms contain "shortness of breath"
- ✓ SpO2 < 96%
- ✓ BP Systolic > 160
- ✓ Known allergies present

### MODERATE if any:
- ✓ Name missing
- ✓ Age missing
- ✓ Vitals (BP, Pulse, SpO2) not recorded

### SAFE if:
- ✓ None of above conditions

---

## 🛠️ Troubleshooting

### Firebase Not Initializing
**Error**: "Firebase not initialized"
- **Fix**: Check `firebase.js` configuration
- Make sure all config values are correct
- Verify Firebase project is active

### Gemini API Returns Error
**Error**: "API Error: Invalid request"
- **Fix**: 
  - Check API key is correct
  - Verify key has Gemini API enabled
  - Check API quotas in Google Cloud Console

### JSON Parse Error
**Error**: "Failed to parse JSON from response"
- **Fix**: Check system prompt in `app.js`
- Gemini should return pure JSON only

### Firestore Rules Issue
**Error**: "Missing or insufficient permissions"
- **Fix**: Go to Firestore → Rules
- Copy this for testing (NOT for production):
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

### Mobile Not Working
**Issue**: App does not work on mobile
- **Fix**: 
  - Ensure Firebase is served over HTTPS
  - Check Firestore rules  
  - Test in incognito mode
  - Clear browser cache

---

## 📝 System Prompt (for evaluation)

```
You are a clinical triage assistant for City General Hospital.

Extract the following fields from the patient intake record provided:
- patientId     : found after "PATIENT ID:"
- name          : patient's full name
- age           : patient's age (integer, or null if missing)
- symptoms      : list of reported symptoms
- allergies     : list of known drug or substance allergies
- medications   : current medications with dosage if mentioned
- bp            : blood pressure reading (e.g. "180/110")
- pulse         : heart rate in bpm
- spo2          : oxygen saturation percentage
- doctorNotes   : any notes from the attending physician

Then apply the following triage rules to determine status:
- If any of the following are present → status = "CRITICAL":
    chest pain, shortness of breath, acute MI, STEMI,
    SpO2 below 96, BP systolic above 160, known drug allergy present
- If name is missing OR age is missing or "?" OR vitals are not recorded → status = "MODERATE"
- Otherwise → status = "SAFE"

Return ONLY a valid JSON object with the above keys plus "status".
Do not include any explanation, markdown formatting, or extra text.
```

---

## 📋 Submission Checklist

- [ ] Live public URL works on desktop and mobile
- [ ] All 3 test cases (PT-001, PT-002, PT-003) submitted
- [ ] Firestore shows PT-001 with status = "CRITICAL"
- [ ] Screenshot of Firestore taken (PT-001 visible)
- [ ] System prompt copied
- [ ] AI Agent Log written (one sentence about tool use)
- [ ] Google Form submitted before deadline

### AI Agent Log Examples:
- "Used GitHub Copilot to debug Firestore real-time listener integration"
- "Copilot helped optimize JSON parsing regex for Gemini API responses"
- "Used Copilot to structure triage classification logic and test cases"

---

## 🎨 UI/UX Features

✓ Responsive design (desktop, tablet, mobile)
✓ Medical-themed color scheme (blue/white/green)
✓ Color-coded status badges (Red/Amber/Green)
✓ Real-time dashboard with Firestore onSnapshot()
✓ Loading spinner during API calls
✓ Error handling with user-friendly messages
✓ Filter dashboard by status
✓ Hover effects on cards
✓ Clean hospital-style typography

---

## 📞 Support

If stuck:
1. Check browser console for errors (F12)
2. Review Firestore console for saved records
3. Verify all API keys are correct
4. Check internet connection
5. Try incognito mode
6. Clear browser cache

---

## ✨ Bonus Features

Already implemented:
- ✓ Real-time Firestore listener
- ✓ Filter by status
- ✓ Clean card-based dashboard
- ✓ Loading spinner
- ✓ Error handling
- ✓ Mobile responsive

Optional to add:
- Batch processing of multiple records
- Animated alerts for CRITICAL cases
- Risk analytics chart
- Search and filter by name/ID

---

**Good luck with the hackathon! 🚀**
