# ✅ MedGuard AI - Verification Checklist

Complete this checklist to verify your MedGuard AI installation is working correctly.

## Pre-Flight Checks

### Environment Setup
- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm 10+ installed (`npm --version`)
- [ ] Working directory: `./medguard-ai`
- [ ] All files present in root directory:
  - [ ] `server.js`
  - [ ] `app.js`
  - [ ] `index.html`
  - [ ] `style.css`
  - [ ] `firebase.js`
  - [ ] `package.json`
  - [ ] `.env.example`
  - [ ] `Dockerfile`

### Dependencies Installation
- [ ] Run `npm install` WITHOUT errors
- [ ] Verify installed packages: `npm list`
  - [ ] express@4.18.2 or higher
  - [ ] cors@2.8.5 or higher
  - [ ] dotenv@16.4.5 or higher

### Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Add GEMINI_API_KEY to `.env`
- [ ] Verify API key is valid (test at [aistudio.google.com](https://aistudio.google.com))
- [ ] Firebase config in `firebase.js` is loaded

## Server Startup

### Start Server
```bash
npm start
```

- [ ] Server starts without errors
- [ ] Startup message shows:
  - [ ] "🏥 MedGuard AI Backend Server"
  - [ ] Server running on: http://0.0.0.0:3000
  - [ ] API Endpoint: POST /api/triage
  - [ ] Health Check: GET /api/health
  - [ ] Frontend: http://localhost:3000

### Check Logs
- [ ] No error messages in console
- [ ] No "Cannot find module" errors
- [ ] No syntax errors
- [ ] No "Missing API key" warnings

## API Endpoint Testing

### Health Check (GET /api/health)
- [ ] Open browser: `http://localhost:3000/api/health`
- [ ] Response is valid JSON: `{"status":"healthy","timestamp":"..."}`
- [ ] HTTP Status: 200 OK
- [ ] No CORS errors in browser console

### Status Endpoint (GET /api/status)
- [ ] Open browser: `http://localhost:3000/api/status`
- [ ] Response includes:
  - [ ] `"status": "running"`
  - [ ] `"apiKey": "✓ Configured"`
  - [ ] `"port": 3000`
- [ ] HTTP Status: 200 OK

### Static Files Serving
- [ ] Visit `http://localhost:3000/` loads index.html
- [ ] Page title shows "MedGuard AI - Clinical Triage System"
- [ ] CSS styles load (page has blue color scheme)
- [ ] JavaScript loads without errors
- [ ] Check browser console (F12) for no errors

## Frontend UI Verification

### Page Layout
- [ ] Header visible with "MedGuard AI" title
- [ ] Live badge shows current time
- [ ] Two-column layout loads:
  - [ ] Left column: "Patient Intake Record" textarea
  - [ ] Right column: Results panel (gray initially)
- [ ] Footer shows version and links

### Buttons and Controls
- [ ] "Run AI Screening" button visible and clickable
- [ ] "Submit to Database" button visible (gray/disabled initially)
- [ ] Filter buttons present: ALL, CRITICAL, MODERATE, SAFE
- [ ] Dashboard section visible below

### Dashboard Section
- [ ] Patient cards container visible (empty initially)
- [ ] Analytics section visible with Chart.js canvas
- [ ] Statistics boxes show: CRITICAL: 0, MODERATE: 0, SAFE: 0

## Patient Screening Test

### Input Test Data
Copy this into the textarea:
```
PATIENT ID: TEST001
NAME: Test Patient
AGE: 45
PRESENTING SYMPTOMS: chest pain, shortness of breath
ALLERGIES: Penicillin
CURRENT MEDICATIONS: Aspirin 81mg daily
VITAL SIGNS:
  BP: 180/110
  Heart Rate: 92 bpm
  SpO2: 94%
DOCTOR NOTES: Test case for triage verification
```

- [ ] Text successfully pasted into textarea
- [ ] No character limit errors

### Run Screening
- [ ] Click "Run AI Screening" button
- [ ] Loading spinner appears
- [ ] Button becomes disabled during processing
- [ ] Wait 3-5 seconds for response

### Verify Results
After screening completes, verify:
- [ ] Loading spinner disappears
- [ ] Button becomes enabled again
- [ ] Results appear in right panel:
  - [ ] Patient ID: TEST001
  - [ ] Name: Test Patient
  - [ ] Age: 45
  - [ ] Symptoms listed
  - [ ] Allergies listed
  - [ ] Medications listed
  - [ ] BP showing: 180/110
  - [ ] Pulse showing: 92
  - [ ] SpO2 showing: 94%
  - [ ] Status badge shows **CRITICAL** (red)
  - [ ] Status reason explains why CRITICAL

- [ ] "Submit to Database" button becomes visible and enabled
- [ ] No JavaScript errors in browser console

### Verify API Communication
Open browser DevTools (F12):
- [ ] Network tab shows POST to `/api/triage`
- [ ] Request Headers:
  - [ ] Content-Type: application/json
  - [ ] Method: POST
- [ ] Response Headers:
  - [ ] Status: 200 OK
  - [ ] Content-Type: application/json
- [ ] Response body is valid JSON (not HTML error page)

## Database Integration Test

### Submit Patient Record
- [ ] Click "Submit to Database" button
- [ ] Success notification appears (check for toast/alert)
- [ ] Patient record sent to Firebase

### View in Dashboard
- [ ] Scroll down to Dashboard section
- [ ] New patient card appears for "Test Patient"
- [ ] Card shows:
  - [ ] Patient name: Test Patient
  - [ ] Status: CRITICAL (red color)
  - [ ] Risk level badge
  - [ ] Patient ID: TEST001
  - [ ] Timestamp of submission

### Analytics Update
- [ ] Chart.js doughnut chart updates
- [ ] CRITICAL count changes from 0 to 1
- [ ] Statistics box updates

### Filter Test
- [ ] Click "CRITICAL" filter button
- [ ] Only CRITICAL patients shown
- [ ] Click "ALL" filter button
- [ ] All patients shown again

## Error Handling Verification

### API Error Handling
1. Stop the server (Ctrl+C)
2. Try to run screening
   - [ ] Error message appears in results panel
   - [ ] Error message is user-friendly (not raw JSON)
   - [ ] "Failed to connect to server" or similar message

3. Restart server (`npm start`)
4. Screening works again

### Invalid API Key Test
1. Edit `.env` and change GEMINI_API_KEY to `invalid_key_12345`
2. Restart server
3. Run screening again
   - [ ] Error appears: "API Error" or "401 Unauthorized"
   - [ ] Frontend doesn't crash
   - [ ] Page remains responsive

### Missing Data Test
1. Restore correct API key in `.env`
2. Restart server
3. Submit intake record with MISSING fields:
```
PATIENT ID: TEST002
NAME:
AGE: ?
SYMPTOMS: mild headache
ALLERGIES:
CURRENT MEDICATIONS:
VITAL SIGNS:
  BP:
  Heart Rate:
  SpO2:
```

4. Run screening
   - [ ] Results appear (not all fields will be filled)
   - [ ] Status is **MODERATE** (yellow) - due to missing name/age/vitals
   - [ ] Error messages don't appear for missing optional data
   - [ ] Database submission still works

## Browser Compatibility

Test on multiple browsers:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Edge (if on Windows)

Verify on each:
- [ ] Page renders correctly
- [ ] Layout responsive (no broken styles)
- [ ] JavaScript executes without errors
- [ ] API calls work
- [ ] Charts render properly

## Mobile/Responsive Test

- [ ] Tablet view (1024px width):
  - [ ] Layout adapts to single column
  - [ ] All buttons clickable
  - [ ] Text readable

- [ ] Mobile view (480px width):
  - [ ] Fully responsive
  - [ ] No horizontal scrolling
  - [ ] Touch-friendly button sizes
  - [ ] All controls accessible

## Performance Check

### Startup Time
- [ ] Server starts in < 2 seconds
- [ ] Frontend loads in < 1.5 seconds

### Screening Time
- [ ] First screening takes 2-5 seconds (API call time)
- [ ] Subsequent screenings similar timing
- [ ] No timeout errors (timeout is 30 seconds)

### Database Operations
- [ ] Patient submission to Firebase < 1 second
- [ ] Dashboard updates in real-time
- [ ] No lag when adding multiple patients

## File System Checks

### Verify No Errors
```bash
# Check for any file issues
npm list --all
```
- [ ] All dependencies resolved
- [ ] No "unmet dependencies" warnings
- [ ] No duplicate packages

### Verify Correct Paths
- [ ] `server.js` line 27 shows:
  ```javascript
  app.use(express.static(__dirname));
  ```
  (NOT `path.join(__dirname, 'public')`)

- [ ] `server.js` line 175 shows:
  ```javascript
  res.sendFile(path.join(__dirname, 'index.html'));
  ```
  (NOT `path.join(__dirname, 'public', 'index.html')`)

### File Permissions
- [ ] All `.js` files are readable and executable
- [ ] `.env` file has restricted permissions (or is in .gitignore)
- [ ] `package.json` is readable

## Git/Version Control

### Ready for Deployment
- [ ] `.env` is in `.gitignore` (not committed)
- [ ] `node_modules/` is in `.gitignore`
- [ ] Only source files committed:
  - [ ] `.js` files
  - [ ] `.html` file
  - [ ] `.css` file
  - [ ] `package.json`
  - [ ] `package-lock.json`
  - [ ] `.env.example`
  - [ ] `Dockerfile`
  - [ ] Documentation (`.md` files)

### Version Information
- [ ] `package.json` version: 1.0.0
- [ ] Node version compatible: >=20.0.0
- [ ] npm version compatible: >=10.0.0

## Final System Test

### Complete Workflow
1. [ ] Clear browser cache
2. [ ] Reload `http://localhost:3000`
3. [ ] Paste patient data
4. [ ] Click "Run AI Screening"
5. [ ] Verify results display
6. [ ] Click "Submit to Database"
7. [ ] Refresh page
8. [ ] Verify patient appears in dashboard
9. [ ] Filter and verify filtering works
10. [ ] Check browser console (F12) - no errors

## Deployment Readiness

- [ ] All tests above pass ✅
- [ ] No console errors or warnings
- [ ] Application is responsive
- [ ] APIs respond quickly
- [ ] Database integration works
- [ ] Error handling is graceful
- [ ] Ready to deploy to Koyeb

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| 404 on `/` | Check `server.js` line 27 uses `__dirname` not `public/` |
| Cannot find firebase | Check `firebase.js` is in root directory |
| API timeout | Check GEMINI_API_KEY is valid in `.env` |
| CORS errors | Verify CORS middleware in `server.js` line 20-22 |
| Port 3000 in use | Change PORT in `.env` to 3001 or check other services |
| Chart not rendering | Check Chart.js loaded in browser (check DevTools Sources) |
| Firebase permission denied | Update Firestore rules to allow read/write |

---

## Verification Summary

**Total Checklist Items**: 100+

**All items checked** ✅ = Application is **PRODUCTION READY**

**Items unchecked** ❌ = Review troubleshooting guide before deployment

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Status**: Ready for verification
