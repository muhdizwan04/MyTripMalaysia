import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// -------------------------------------------------------------
// 🚨 MISSING CONFIGURATION
// Please paste your Firebase keys here.
// You can find these in your Firebase Console > Project Settings.
// -------------------------------------------------------------
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_BUCKET.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Initialize App
let app;
let auth;
let db;

try {
    // Only initialize if we have a valid config, otherwise mock it for dev
    if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
        app = initializeApp(firebaseConfig);
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
        db = getFirestore(app);
    } else {
        console.warn("⚠️ Firebase keys missing. Using mock auth/db to prevent crash.");
        // Mock objects to prevent app crash on import
        auth = { currentUser: null };
        db = {};
        app = {};
    }
} catch (error) {
    console.error("❌ Firebase Init Error:", error);
    // Fallback mocks
    auth = { currentUser: null };
    db = {};
    app = {};
}

export { app, auth, db };
