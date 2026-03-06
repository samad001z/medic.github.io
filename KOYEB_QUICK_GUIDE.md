# 🚀 Koyeb Deployment Checklist

## Pre-Deployment (Local Setup)

### Files to Verify Exist:
- ✅ `server.js` - Backend server code
- ✅ `Dockerfile` - Docker configuration
- ✅ `package.json` - Node dependencies
- ✅ `.dockerignore` - Docker build ignore rules
- ✅ `index.html` - Frontend (will be in public folder during deploy)
- ✅ `style.css` - Styles (will be in public folder during deploy)
- ✅ `app.js` - Frontend logic (will be in public folder during deploy)
- ✅ `firebase.js` - Firebase config (will be in public folder during deploy)
- ✅ `.env.example` - Example environment variables

### Commands to Run:

```bash
# 1. Install dependencies locally (optional but recommended)
npm install

# 2. Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# 3. Create GitHub repository and push
# Go to https://github.com/new
# Create repo named "medguard-ai"
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/medguard-ai.git
git branch -M main
git push -u origin main
```

---

## On Koyeb Dashboard

### 🔵 Step 1: Create Service

1. Go to https://koyeb.com
2. Click **"Create Service"** (top right)
3. Choose deployment method: **Docker**
4. Click **"Use a GitHub repository"**
5. Click **"Connect GitHub"** (if not connected)

### 🟢 Step 2: Select Repository

1. Authorize Koyeb to access GitHub
2. Select: **medguard-ai** repository
3. Select branch: **main**
4. Builder: **Dockerfile** (default)
5. Dockerfile path: `/Dockerfile` (default)
6. Click **"Next"**

### 🟡 Step 3: Environment Variables

**Click "Environment Variables" section**

**Add these ONE BY ONE:**

```
1. PORT = 3000
2. NODE_ENV = production
3. GEMINI_API_KEY = YOUR_ACTUAL_API_KEY
4. FIREBASE_API_KEY = YOUR_FIREBASE_KEY
5. FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
6. FIREBASE_DATABASE_URL = https://your_project.firebaseio.com
7. FIREBASE_PROJECT_ID = your_project_id
8. FIREBASE_STORAGE_BUCKET = your_project.appspot.com
9. FIREBASE_MESSAGING_SENDER_ID = your_sender_id
10. FIREBASE_APP_ID = your_app_id
```

### 🟣 Step 4: Service Configuration

**Port Configuration:**
- Port: `3000`
- Protocol: `HTTP`
- (HTTPS is automatic)

**Service Name:**
- Name: `medguard-ai` (or your choice)
- Region: Choose closest to your users
  - 🇺🇸 Washington DC `wdc`
  - 🇪🇺 Frankfurt `fra`
  - 🇯🇵 Tokyo `nrt`
  - 🇸🇬 Singapore `sin`

### 🔴 Step 5: Review & Deploy

1. Verify all settings are correct
2. Click **"Create Service"**
3. Wait for deployment (usually 2-5 minutes)

---

## Deployment Logs

Watch the logs for this message:
```
🏥 MedGuard AI Server running on port 3000
```

When you see it, deployment is successful! ✅

---

## After Deployment

### Access Your App
1. Go to Koyeb dashboard
2. Click your `medguard-ai` service
3. Copy the **Public URL** (e.g., `https://medguard-ai-xxxxx.koyeb.app`)
4. Open in browser

### Test Functionality
1. Paste a sample patient record
2. Click "Run AI Screening"
3. Verify results appear
4. Try submitting to database

### Monitor
- Check **Logs** tab for errors
- Check **Metrics** for CPU/Memory
- Health status should show 🟢 GREEN

---

## Getting Required Keys

### 📊 Gemini API Key

1. Go to https://aistudio.google.com
2. Click **"Get API Key"** (top left)
3. Click **"Create API Key"**
4. Copy the key

### 🔥 Firebase Keys

1. Go to https://console.firebase.google.com
2. Select your project
3. Click **⚙️ Settings** (bottom left)
4. Click **"Project Settings"**
5. Copy values from the webpage config object:
   ```
   const firebaseConfig = {
     apiKey: "COPY_THIS",
     authDomain: "COPY_THIS",
     databaseURL: "COPY_THIS",
     projectId: "COPY_THIS",
     storageBucket: "COPY_THIS",
     messagingSenderId: "COPY_THIS",
     appId: "COPY_THIS"
   };
   ```

---

## Troubleshooting

### ❌ Build Failed
**Check:**
1. GitHub repository exists and is public
2. All files committed and pushed
3. Build logs for specific errors

**Fix:**
```bash
# Push latest changes
git add .
git commit -m "Fix deployment"
git push origin main
# Click "Redeploy" in Koyeb dashboard
```

### ❌ Deployment Timeout
**Cause:** Taking too long to build Docker image

**Fix:**
1. Wait longer (some regions slower)
2. Try different region
3. Check Docker syntax in Dockerfile

### ❌ "Connection Refused"
**Cause:** App not started

**Check logs in Koyeb dashboard:**
- Click service → "Logs" tab
- Look for error messages
- Common: Missing environment variables

### ❌ "Gemini API Error"
**Check:**
1. API key is correct
2. API key enabled at https://aistudio.google.com
3. No typos in .env variable name
4. Not exceeding rate limit (60 requests/minute free tier)

### ❌ "Firebase Error"
**Check:**
1. All Firebase keys are correct
2. Firestore database created in Firebase Console
3. Security rules allow operations
4. Project ID matches

### ❌ "Static Files Not Loading"
**Check:**
1. Files are in Dockerfile `COPY public/` line
2. Files committed to GitHub
3. Correct filenames (case-sensitive)

---

## Auto-Redeployment

**Automatic on Git Push:**
1. Edit code locally
2. `git push origin main`
3. Koyeb detects change
4. Rebuilds automatically
5. No downtime! (usually)

---

## View Logs

**In Koyeb Dashboard:**
1. Click your service
2. Click **"Logs"** tab
3. Real-time application output
4. Scroll to see history

**Common Log Messages:**
```
✅ "Server running on port 3000" - ALL GOOD
✅ "Firebase initialized successfully" - DB connected
❌ "Error: listen EADDRINUSE" - Port conflict
❌ "TypeError: firebase is not defined" - Config issue
```

---

## Scale Your Service

**If getting high traffic:**
1. Koyeb auto-scales (free tier limited)
2. Upgrade to paid plan for more instances
3. Service handles scaling automatically

---

## Update Application

**To deploy new version:**
```bash
# Make changes
nano app.js  # or your editor

# Deploy
git add .
git commit -m "Update feature"
git push origin main

# Koyeb automatically redeploys!
```

---

## Cost

**Free tier includes:**
- 2 deployments/month
- Up to 2 allocated vCPU
- 512 MB RAM
- Generous free tier quota

**For production**, consider paid plan for:
- More deployments
- Custom domains
- Priority support
- Higher resources

---

## Support Links

- 📖 Koyeb Docs: https://docs.koyeb.com
- 💬 Koyeb Discord: https://discord.gg/koyeb
- 🔥 Firebase Docs: https://firebase.google.com/docs
- 🤖 Gemini API: https://ai.google.dev/docs

---

## Next Steps After Deploy

1. ✅ Set custom domain (optional)
2. ✅ Monitor logs regularly
3. ✅ Test all features in production
4. ✅ Set up alerts/monitoring
5. ✅ Plan scaling if needed

---

**Your app is now live on Koyeb! 🎉**

Share your URL: `https://medguard-ai-xxxxx.koyeb.app`
