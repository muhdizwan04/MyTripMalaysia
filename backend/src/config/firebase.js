const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Load serviceAccountKey.json from config directory
let serviceAccount;
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

try {
    serviceAccount = require(keyPath);
    console.log('✅ Service account key loaded successfully from:', keyPath);
} catch (error) {
    console.log('⚠️  No serviceAccountKey.json found at:', keyPath);
    console.log('Attempting to use environment variables or default credentials.');
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'mytripmalaysia-b3e4d.appspot.com'
    });
    console.log('✅ Firebase Admin Initialized Successfully');
} else {
    // Fallback for production or if using env vars
    admin.initializeApp({
        storageBucket: 'mytripmalaysia-b3e4d.appspot.com'
    });
    console.log('⚠️  Firebase initialized with default credentials');
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
