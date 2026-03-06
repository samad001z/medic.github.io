# MedGuard AI - Koyeb Deployment Guide

Complete step-by-step guide to deploy MedGuard AI on Koyeb with full production setup.

## 📋 Prerequisites

Before you begin, ensure you have:
- GitHub account (to store your code)
- Koyeb account (https://koyeb.com - free tier available)
- Google Gemini API key (https://aistudio.google.com)
- Firebase project set up

## 🚀 Step 1: Prepare Your Code for Deployment

### 1.1 Install Dependencies Locally (Optional - for testing)

```bash
npm install
```

### 1.2 Update Environment Variables

Edit `.env` file with your credentials:

```bash
# Copy from example
cp .env.example .env
```

Then edit `.env`:
```
PORT=3000
NODE_ENV=production
GEMINI_API_KEY=your_actual_gemini_api_key_here
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### 1.3 Test Locally (Optional)

```bash
npm start
```

Visit `http://localhost:3000` to verify it works.

---

## 📤 Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial MedGuard AI deployment"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create repository named `medguard-ai`
3. Do NOT initialize with README (you have one already)

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/medguard-ai.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Create Koyeb Account & Project

### 3.1 Sign Up for Koyeb

1. Go to https://koyeb.com
2. Click "Start for free"
3. Sign up with GitHub (recommended)
4. Grant repository access permissions

### 3.2 Create New Service

After login, on the dashboard:

1. Click **"Create Service"** button
2. Choose **"Docker"** deployment method
3. Select **"Use a GitHub repository"**
4. Authorize Koyeb to access your GitHub

### 3.3 Configure Repository

1. Select your GitHub account
2. Find and select the `medguard-ai` repository
3. Select branch: `main`
4. Click **"Next"**

---

## ⚙️ Step 4: Configure Deployment

### 4.1 Builder Settings

**Builder:** Select "Dockerfile"
- Dockerfile path: `/Dockerfile` (leave default)
- Build context: `/` (leave default)

### 4.2 Environment Variables

Click **"Environment Variables"** →  **"Add Variable"**

Add all these variables:

```
PORT=3000
NODE_ENV=production
GEMINI_API_KEY=your_actual_key_here
FIREBASE_API_KEY=your_firebase_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

**Get these values from:**

**For Gemini API Key:**
1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Click "Create API Key"
4. Copy the key

**For Firebase:**
1. Go to https://console.firebase.google.com
2. Select your project
3. Click **Settings ⚙️** (bottom left)
4. Go to **Project Settings**
5. Copy all values from the config

### 4.3 Port Configuration

Make sure the service is listening on the correct port:
- **Port:** `3000`
- **Protocol:** HTTP

The Dockerfile already exposes port 3000.

---

## 🚀 Step 5: Deploy

### 5.1 Review & Deploy

1. Click **"Service Name"** and name it (e.g., `medguard-ai`)
2. Select **Region**: Choose closest to your users (e.g., `Washington DC`, `Frankfurt`)
3. Click **"Create Service"**

### 5.2 Monitor Deployment

Koyeb will:
1. Build the Docker image
2. Deploy the container
3. Start the application

You'll see deployment logs in real-time. Wait for:
```
🏥 MedGuard AI Server running on port 3000
```

---

## 🌍 Step 6: Access Your Application

Once deployed:

1. Go to your Koyeb dashboard
2. Find your `medguard-ai` service
3. Click it to see details
4. Copy the **Public URL** (looks like: `https://medguard-ai-xxxxx.koyeb.app`)
5. Open the URL in your browser

**That's it! Your app is now live!** 🎉

---

## 📝 Usage After Deployment

1. Open the public URL in your browser
2. Paste a patient intake record in the screening form
3. Click "Run AI Screening"
4. Results will be extracted and classified by the AI
5. Click "Submit to Database" to save to Firebase

---

## 🔧 Troubleshooting

### Issue: "Build Failed"

**Solution:**
1. Check Dockerfile path is correct: `/Dockerfile`
2. Ensure all files are committed to GitHub
3. Verify `package.json` exists in root directory
4. Check build logs for specific errors

### Issue: "Application won't start - port error"

**Solution:**
1. Ensure `PORT=3000` is set in environment variables
2. Check Dockerfile exposes port 3000
3. Verify `server.js` listens on `0.0.0.0:3000`

### Issue: "Gemini API Error"

**Solution:**
1. Verify API key is correct in environment variables
2. Check API key is enabled on https://aistudio.google.com
3. Ensure no extra spaces or quotes in key
4. Check rate limits haven't been exceeded

### Issue: "Firebase Connection Error"

**Solution:**
1. Verify all Firebase credentials are correct
2. Check Firebase project ID matches
3. Ensure Firestore database is created
4. Verify Firebase security rules allow reads/writes

### Issue: "Frontend not loading CSS/JS"

**Solution:**
1. Check that files are in `public/` directory:
   - `index.html`
   - `style.css`
   - `app.js`
   - `firebase.js`
2. Verify Dockerfile copies these correctly
3. Clear browser cache (Ctrl+Shift+Delete)

### View Logs

In Koyeb dashboard:
1. Select your service
2. Click **"Logs"** tab
3. View real-time application logs

---

## 📊 Monitor Your Service

### 1. Health Checks

Koyeb automatically checks:
- `/api/health` endpoint every 30 seconds
- 🟢 Green = Healthy
- 🔴 Red = Issues

### 2. Metrics

In Koyeb dashboard:
1. Click your service
2. View **"Metrics"** tab for:
   - CPU usage
   - Memory usage
   - Request count
   - Restart count

### 3. Auto-Restart

If the application crashes:
- Koyeb automatically restarts it
- No manual intervention needed

---

## 🔄 Update Your Application

### To Deploy New Changes:

```bash
# Make your changes locally
git add .
git commit -m "Your changes"
git push origin main
```

Koyeb will:
1. Detect the push
2. Rebuild automatically
3. Deploy without downtime

---

## 💾 Backup & Data

### Firebase Data Backup

1. Go to Firebase Console
2. Select your project
3. Go to **Firestore**
4. Click **⋮ (three dots)** → **Backup**
5. Set up automatic daily backups

### Database Export

```bash
# Via Firebase CLI (optional)
firebase firestore:export ./backup
```

---

## 🔐 Security Best Practices

✅ **Already Implemented:**
- API keys stored in Koyeb environment (not in code)
- Backend handles sensitive API calls
- Frontend makes requests to backend only
- Dockerfile runs as non-root user
- Health checks enabled

✅ **Recommended Next Steps:**
1. Enable Firebase Authentication
2. Set up custom domain
3. Enable HTTPS (automatic with Koyeb)
4. Set up CI/CD for automated testing
5. Enable error tracking (Sentry, LogRocket)

---

## 📞 Support & Help

**Koyeb Documentation:**
- https://docs.koyeb.com

**Koyeb Community:**
- https://discord.gg/koyeb

**Firebase Documentation:**
- https://firebase.google.com/docs

**Google Gemini API:**
- https://ai.google.dev/docs

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Go to Koyeb dashboard
   - Click your service
   - Add custom domain under "Settings"

2. **Continuous Deployment**
   - Push to `main` branch in GitHub
   - Koyeb automatically rebuilds and deploys

3. **Monitor Performance**
   - Check logs regularly
   - Monitor error rates
   - Optimize based on usage patterns

4. **Scale Up (if needed)**
   - Koyeb handles scaling automatically
   - Upgrade to paid plan for more resources

---

## 📋 Deployment Checklist

- [ ] GitHub account created and repository pushed
- [ ] Koyeb account created
- [ ] Gemini API key generated and added to environment
- [ ] Firebase credentials added to environment
- [ ] Dockerfile and package.json verified
- [ ] Environment variables configured in Koyeb
- [ ] Deployment completed successfully
- [ ] Public URL is accessible
- [ ] Application health check passing
- [ ] Firebase connection working
- [ ] AI screening feature working

---

**Congratulations! Your MedGuard AI application is now running on Koyeb! 🚀🏥**

For issues or questions, check the Koyeb logs or contact support.
