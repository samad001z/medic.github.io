// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfMVnOQa7XIyWcay3-VBwvaEXSlwHPwxM",
  authDomain: "medic-ai-7a603.firebaseapp.com",
  projectId: "medic-ai-7a603",
  storageBucket: "medic-ai-7a603.firebasestorage.app",
  messagingSenderId: "585189256339",
  appId: "1:585189256339:web:5f66b2bb7ba67affbbb166"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Get Firestore instance
const db = firebase.firestore();

// Export for use in app.js
window.firebaseDB = {
    db: db,
    serverTimestamp: firebase.firestore.FieldValue.serverTimestamp
};
