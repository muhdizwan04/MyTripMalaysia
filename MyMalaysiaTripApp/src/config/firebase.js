import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// -------------------------------------------------------------
// 🚨 FIREBASE CONFIG REQUIRED FOR DATABASE & AUTH
// Your app cannot read from Firebase until these are set.
//
// Get them from: Firebase Console → your project → Project settings (gear)
// → Your apps → select your Web app (or add one) → copy the config object.
//
// Backend uses project: mytripmalaysia-b3e4d — use the SAME project’s Web app config here.
// -------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyDT6x-cHHGsaPBvhKt8Dr9BUH_P6E6_asM",
    authDomain: "mytripmalaysia-b3e4d.firebaseapp.com",
    projectId: "mytripmalaysia-b3e4d",
    storageBucket: "mytripmalaysia-b3e4d.firebasestorage.app",
    messagingSenderId: "897589628896",
    appId: "1:897589628896:ios:b4b84629bf85de1c0a6585"
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
