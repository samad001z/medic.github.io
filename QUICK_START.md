# 🚀 MedGuard AI - Quick Start Guide

## Prerequisites

- **Node.js**: 20+ installed
- **npm**: 10+ installed
- **Gemini API Key**: Get from [Google AI Studio](https://aistudio.google.com)
- **Firebase Project**: Already configured (firebaseConfig in firebase.js)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

Expected output:
```
added 3 packages from 6 contributors
```

### 2. Create Environment Configuration

Create `.env` file in the root directory with your API key:

```bash
# Linux/Mac
cp .env.example .env

# Windows
copy .env.example .env
```

Then edit `.env` and add your Gemini API key:

```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 3. Start the Server

```bash
npm start
```

Expected output:
```
╔════════════════════════════════════════════╗
║  🏥 MedGuard AI Backend Server            ║
╚════════════════════════════════════════════╝

✓ Server running on: http://0.0.0.0:3000
✓ Environment: development
✓ API Endpoint: POST /api/triage
✓ Health Check: GET /api/health
✓ Frontend: http://localhost:3000

Ready to process patient screening data...
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the MedGuard AI dashboard with the modern glassmorphism design.

## Testing the Application

### Test 1: Health Check

Visit in your browser or curl:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"healthy","timestamp":"2024-01-15T10:30:45.123Z"}
```

### Test 2: Status Check

```bash
curl http://localhost:3000/api/status
```

Expected response:
```json
{
  "status": "running",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "environment": "development",
  "uptime": 12.034,
  "apiKey": "✓ Configured",
  "port": 3000
}
```

### Test 3: Patient Screening

1. Copy the sample patient data below into the "Patient Intake Record" textarea:

```
PATIENT ID: P123456
NAME: John Smith
AGE: 45
PRESENTING SYMPTOMS: chest pain, shortness of breath
ALLERGIES: Penicillin, Aspirin
CURRENT MEDICATIONS: Metoprolol 50mg daily, Atorvastatin 20mg daily
VITAL SIGNS:
  BP: 180/110
  Heart Rate: 92 bpm
  SpO2: 94%
DOCTOR NOTES: Patient arrived via ambulance at 14:30, presenting with acute cardiac symptoms
```

2. Click **"Run AI Screening"**

3. Observe results in the right panel:
   - ✅ Status should be **CRITICAL** (due to chest pain, shortness of breath, high BP, allergy history)
   - ✅ All patient fields extracted correctly
   - ✅ Color-coded risk badge displayed

### Test 4: Submit to Database

1. After successful screening, click **"Submit to Database"**

2. Wait for success notification

3. Refresh page or scroll to **Dashboard** section

4. You should see your patient card in the patient list

5. Filter by **CRITICAL** to see the submitted patient

## Troubleshooting

### Issue: "Cannot GET /pages/dashboard" or 404 error

**Solution**: The server is serving static files incorrectly. Make sure `server.js` line 27 uses:
```javascript
app.use(express.static(__dirname));
```
NOT:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

### Issue: "API Error: 401" when running screening

**Solution**: The Gemini API key in `.env` is invalid or missing.
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key" 
3. Copy your API key
4. Update `.env` with the correct key
5. Restart the server (`npm start`)

### Issue: "FirebaseError: Missing or insufficient permissions"

**Solution**: Firebase Firestore rules need updating. In Firebase Console:
1. Go to Firestore Database
2. Go to Rules tab
3. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Issue: Port 3000 already in use

**Solution**: Change the port in `.env`:
```env
PORT=3001
```

Then access at `http://localhost:3001`

## File Structure

```
medguard-ai/
├── server.js           # Express backend (handles API calls securely)
├── app.js             # Frontend JavaScript logic
├── index.html         # Main UI (glasmorphism design)
├── style.css          # Modern CSS with backdrop blur
├── firebase.js        # Firebase Firestore configuration
├── firebase.compat.js # Firebase Compat Library (from CDN in index.html)
├── package.json       # Dependencies: express, cors, dotenv
├── .env.example       # Environment variable template
├── Dockerfile         # Production container configuration
└── README.md          # Full documentation
```

## API Endpoints

### GET `/api/health`
- Returns server health status
- Response: `{"status":"healthy","timestamp":"..."}`

### GET `/api/status`
- Returns detailed server status
- Response: Full status object with environment, uptime, API key status

### POST `/api/triage`
- Processes patient intake and returns AI-generated triage classification
- Request body:
```json
{
  "patientIntake": "Patient intake text with symptoms, vitals, etc."
}
```
- Response:
```json
{
  "patientId": "P123456",
  "name": "John Smith",
  "age": 45,
  "symptoms": ["chest pain", "shortness of breath"],
  "allergies": ["Penicillin", "Aspirin"],
  "medications": ["Metoprolol 50mg daily", "Atorvastatin 20mg daily"],
  "bp": "180/110",
  "pulse": 92,
  "spo2": 94,
  "doctorNotes": "Patient presented with acute cardiac symptoms",
  "status": "CRITICAL"
}
```

### GET `*` (All other routes)
- Serves `index.html` for SPA routing
- Allows client-side navigation

## Security Notes

⚠️ **Production Deployment**:
1. Never commit `.env` or real API keys to git
2. Use GitHub Secrets or environment variables on hosting platform
3. Enable HTTPS/TLS on production
4. Restrict CORS to specific origins
5. Implement rate limiting on `/api/triage` endpoint
6. Add authentication/authorization for database access

## Performance Optimization

The application implements:
- ✅ Lazy loading of patient data in dashboard
- ✅ Client-side filtering (avoids composite indexes)
- ✅ Real-time Firestore listeners with onSnapshot()
- ✅ Chart.js destruction before re-rendering
- ✅ Backend API call timeout handling
- ✅ Retry logic with exponential backoff

## Next Steps

### Deploy to Koyeb Production

1. Push to GitHub repository
2. On Koyeb dashboard, create new service
3. Select this GitHub repository
4. Set environment variables:
   - `GEMINI_API_KEY=your_key`
   - `NODE_ENV=production`
5. Deploy (uses Dockerfile automatically)
6. Service lives at `your-service.koyeb.app`

### Development Workflow

```bash
# Development with auto-restart (requires nodemon)
npm install --save-dev nodemon
# Update package.json script: "dev": "nodemon server.js"
npm run dev

# Production build
npm run build

# Testing
npm test
```

## Support

For issues or questions:
1. Check server logs: Look for `🏥 MedGuard AI` startup message
2. Enable debug mode: Set `NODE_ENV=development`
3. Check browser console for frontend errors
4. Verify API key is correct and active
5. Ensure Firebase project is accessible

---

**Status**: ✅ Ready for production deployment

**Last Updated**: 2024-01-15

**Version**: 1.0.0
