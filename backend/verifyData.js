const admin = require("firebase-admin");
const serviceAccount = require("./src/config/serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function verify() {
    const snapshot = await db.collection("attractions").where("type", "==", "Mall").get();
    console.log(`Found ${snapshot.size} malls with type: 'Mall'`);
    snapshot.docs.forEach(doc => {
        console.log(`- ${doc.id}: ${doc.data().name}`);
    });

    const shopsSnapshot = await db.collection("shops").get();
    console.log(`Found ${shopsSnapshot.size} total shops`);

    process.exit();
}

verify();
