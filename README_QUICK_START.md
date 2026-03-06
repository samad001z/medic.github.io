# 🏥 MedGuard AI - Patient Safety Intelligence

**AI-powered clinical triage and patient risk screening system for healthcare professionals**

[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
[![Firebase](https://img.shields.io/badge/Firebase-Real--time-orange)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)](https://ai.google.dev)

---

## ✨ Features

- **🤖 AI-Powered Triage**: Google Gemini API analyzes patient intake for risk classification
- **⚡ Real-Time Dashboard**: Live patient monitoring with Firestore real-time updates
- **📊 Risk Distribution**: Visual analytics showing CRITICAL/MODERATE/SAFE patient breakdown
- **🔒 Secure**: Backend API securely handles sensitive operations, API keys protected
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **🏃 Fast**: Lightweight, optimized for healthcare environments

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm/yarn
- Google Gemini API key (free: https://aistudio.google.com)
- Firebase project

### Local Development

1. **Clone & Setup**
```bash
git clone https://github.com/YOUR_USERNAME/medguard-ai.git
cd medguard-ai
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env and add your credentials
```

3. **Start Development Server**
```bash
npm start
```

4. **Open in Browser**
```
http://localhost:3000
```

---

## 🌐 Deploy to Koyeb (Production)

**See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions**

### 30-Second Summary:

1. Push to GitHub: `git push origin main`
2. Create service on https://koyeb.com
3. Connect GitHub repository
4. Add environment variables
5. Deploy!

Your app will be live at: `https://medguard-ai-xxxxx.koyeb.app`

---

## 📋 Project Structure

```
medguard-ai/
├── server.js                 # Express backend server
├── package.json              # Dependencies & scripts
├── Dockerfile                # Docker configuration
├── .env.example              # Environment variables template
├── .dockerignore              # Docker build ignore
├── .gitignore                # Git ignore
│
├── index.html                # Frontend UI
├── style.css                 # Styling (glassmorphism design)
├── app.js                    # Frontend application logic
├── firebase.js               # Firebase initialization
│
└── DEPLOYMENT_GUIDE.md       # Koyeb deployment guide
```

---

## 🔧 Environment Variables

**Required:**

```env
GEMINI_API_KEY=your_api_key_here
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

**Optional:**

```env
PORT=3000                    # Default: 3000
NODE_ENV=production          # Default: development
```

---

## 🎯 How It Works

### Patient Screening Process

1. **Input**: Healthcare professional enters patient intake record
2. **Processing**: Backend sends to Google Gemini API for analysis
3. **Classification**: AI classifies as CRITICAL, MODERATE, or SAFE
4. **Storage**: Patient data saved to Firestore
5. **Display**: Dashboard updates in real-time

### Risk Classification

| Status | Trigger | Color |
|--------|---------|-------|
| **CRITICAL** 🔴 | Chest pain OR shortness of breath OR SpO2<96 OR BP>160 OR allergies present | Red |
| **MODERATE** 🟡 | Missing name OR age OR any vital signs missing | Amber |
| **SAFE** 🟢 | All data present, no critical indicators | Green |

---

## 🔐 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Frontend)                     │
│  index.html | style.css | app.js | firebase.js             │
└──────────────────────┬──────────────────────────────────────┘
                       │ (HTTP Requests)
                       ↓
        ┌──────────────────────────────┐
        │   Express Backend (Node.js)  │
        │   server.js                  │
        │   ✅ API key secure          │
        │   ✅ Gemini API calls        │
        └──────────┬───────────────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
    [Gemini API]         [Firebase]
    (Pure JSON)        (Real-time DB)
```

**Keys stored in backend environment, never exposed to frontend!**

---

## 📚 API Endpoints

### Health Check
```
GET /api/health
→ {"status": "healthy", "timestamp": "2024-03-06T..."}
```

### Patient Triage
```
POST /api/triage
Request: {"patientIntake": "patient data here..."}
Response: {"patientId": "...", "status": "CRITICAL", ...}
```

### Static Files
```
GET /                  → index.html
GET /style.css         → CSS stylesheet
GET /app.js            → Frontend logic
GET /firebase.js       → Firebase config
```

---

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build Production Image
```bash
docker build -t medguard-ai .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key medguard-ai
```

### Run Tests
```bash
npm test
```

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### "Gemini API Error"
- Verify API key is correct in `.env`
- Check API is enabled: https://aistudio.google.com
- Ensure no rate limiting (free tier: 60 RPM)

### "Firebase Connection Failed"
- Verify all Firebase credentials in `.env`
- Check Firestore database is created
- Test connection in Firebase Console

---

## 📖 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete Koyeb deployment guide
- **[TECHNICAL.md](./TECHNICAL.md)** - Technical architecture details
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Initial setup instructions

---

## 🤝 Contributing

Contributions welcome! This is an open-source project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini API** - AI-powered analysis
- **Firebase** - Real-time database & hosting
- **Koyeb** - Container deployment platform
- **Express.js** - Backend framework

---

## 📞 Support

**Issues or questions?**

- 📖 Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🐛 Open an issue on GitHub
- 💬 Visit Koyeb docs: https://docs.koyeb.com

---

## 🎯 Roadmap

- [ ] User authentication & profiles
- [ ] Multi-user support with role-based access
- [ ] Advanced analytics & reporting
- [ ] SMS/Email alerts for critical patients
- [ ] Integration with EHR systems
- [ ] Mobile app (React Native)
- [ ] Multilingual support

---

**Made with ❤️ for better patient safety**

🏥 **MedGuard AI** - Because every second counts in healthcare.
