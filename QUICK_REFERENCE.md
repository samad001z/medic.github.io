# MedGuard AI - Quick Reference Card

## ⏱️ 120-Minute Timeline

| Time | Task | Status |
|------|------|--------|
| 0:00-0:20 | Setup Firebase & get Gemini API key | Setup phase |
| 0:20-0:55 | Build intake UI + connect Gemini | Milestone 2 |
| 0:55-1:25 | Implement triage logic + Firestore | Milestone 3 |
| 1:25-1:55 | Build live dashboard | Milestone 4 |
| 1:55-2:20 | Deploy to public URL | Milestone 5 |
| 2:20-2:30 | Submit Google Form | Submission |

---

## 🔑 Configuration Checklist

### 1. Firebase Setup
```
1. Create project at console.firebase.google.com
2. Create Firestore Database (Test Mode)
3. Get config from Project Settings
4. Paste into firebase.js
```

### 2. Gemini API Key
```
1. Go to aistudio.google.com/app/apikey
2. Create API Key
3. Paste into app.js: GEMINI_API_KEY: 'YOUR_KEY'
```

### 3. Firestore Rules (Test Mode)
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

---

## 🧪 Test Cases (Ctrl+C / Cmd+C to Copy)

### PT-001: CRITICAL
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
→ Expected: 🔴 **CRITICAL**

### PT-002: SAFE
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
→ Expected: 🟢 **SAFE**

### PT-003: MODERATE
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
→ Expected: 🟡 **MODERATE**

---

## 🚀 Deployment (Choose 1)

### Option A: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```
**Live at**: `https://YOUR_PROJECT_ID.web.app`

### Option B: Vercel
1. Go to vercel.com
2. Upload folder
3. Deploy
**Live at**: `https://your-project.vercel.app`

### Option C: Netlify
1. Go to netlify.com
2. Drag and drop folder
3. Deploy
**Live at**: `https://your-project.netlify.app`

---

## 📊 Triage Rules

### ✅ CRITICAL if:
- "chest pain" in symptoms
- "shortness of breath" in symptoms  
- SpO2 < 96
- BP systolic > 160
- Allergies present

### ⚠️ MODERATE if:
- Name missing
- Age missing
- Vitals not recorded

### 🟢 SAFE otherwise

---

## 📱 What to Submit

### Google Form Needs:
1. **Live URL**: `https://your-app-url.com`
2. **System Prompt**: [Copy from SETUP_GUIDE.md]
3. **Firebase Screenshot**: Show PT-001 record with CRITICAL status
4. **AI Agent Log**: One sentence, e.g., "Used Copilot to debug Firestore integration"

### Pre-Submission Checks:
- [ ] URL loads on mobile
- [ ] PT-001 is CRITICAL in Firestore
- [ ] PT-002 is SAFE in Firestore
- [ ] PT-003 is MODERATE in Firestore
- [ ] Dashboard shows all 3 records
- [ ] Real-time updates work
- [ ] System prompt is ready
- [ ] Screenshot is ready

---

## 🆘 Common Errors

| Error | Fix |
|-------|-----|
| Firebase not initialized | Check firebase.js config |
| Gemini API error | Verify API key is correct |
| JSON parse error | Check Gemini system prompt |
| Records not saving | Check Firestore rules |
| Mobile not working | Verify HTTPS deployment |

---

## 💡 Pro Tips

1. **Test locally first** - Open index.html in browser
2. **Use browser console** (F12) to debug errors
3. **Check Firestore console** to verify records saved
4. **Test all 3 cases** before deployment
5. **Take screenshot NOW** of PT-001 record
6. **Save system prompt** in a text file
7. **Write AI Log early** while fresh in memory

---

## 📝 System Prompt (for submission)

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

**Time: 120 minutes | Team: 2-4 people | Marks: 100 points**

🚀 **Let's build MedGuard AI!**
