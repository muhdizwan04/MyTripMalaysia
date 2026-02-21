#!/usr/bin/env node
/**
 * Reads GoogleService-Info.plist and prints the firebaseConfig for src/config/firebase.js
 * Run: node scripts/firebase-config-from-plist.js
 * Or:  node scripts/firebase-config-from-plist.js /path/to/GoogleService-Info.plist
 */
const fs = require('fs');
const path = require('path');

const customPath = process.argv[2];
const plistPath = customPath
  ? path.resolve(process.cwd(), customPath)
  : path.join(__dirname, '..', 'GoogleService-Info.plist');

if (!fs.existsSync(plistPath)) {
  console.error('❌ GoogleService-Info.plist not found at:', plistPath);
  console.error('');
  console.error('Either:');
  console.error('  1. Put your downloaded plist in the MyMalaysiaTripApp folder, then run this script again.');
  console.error('  2. Or run: node scripts/firebase-config-from-plist.js /path/to/GoogleService-Info.plist');
  process.exit(1);
}

const xml = fs.readFileSync(plistPath, 'utf8');
const keyRegex = /<key>([^<]+)<\/key>\s*<string>([^<]*)<\/string>/g;
const raw = {};
let m;
while ((m = keyRegex.exec(xml)) !== null) raw[m[1]] = m[2];

const projectId = raw.PROJECT_ID || raw.project_id;
const apiKey = raw.API_KEY || raw.api_key;
const storageBucket = raw.STORAGE_BUCKET || (raw.PROJECT_ID ? `${raw.PROJECT_ID}.appspot.com` : '');
const appId = raw.GOOGLE_APP_ID || raw.APP_ID || raw.app_id;
const messagingSenderId = raw.GCM_SENDER_ID || raw.PROJECT_NUMBER || raw.messaging_sender_id;
const clientId = raw.CLIENT_ID;

const firebaseConfig = {
  apiKey: apiKey || 'YOUR_API_KEY_HERE',
  authDomain: (raw.PROJECT_ID || projectId) ? `${raw.PROJECT_ID || projectId}.firebaseapp.com` : 'YOUR_PROJECT.firebaseapp.com',
  projectId: raw.PROJECT_ID || projectId || 'YOUR_PROJECT_ID',
  storageBucket: storageBucket || 'YOUR_BUCKET.appspot.com',
  messagingSenderId: messagingSenderId || 'SENDER_ID',
  appId: appId || 'APP_ID',
};

console.log('Paste this into src/config/firebase.js (replace the firebaseConfig object):\n');
console.log('const firebaseConfig = ' + JSON.stringify(firebaseConfig, null, 4) + ';');
console.log('\nThen save and reload the app.');
