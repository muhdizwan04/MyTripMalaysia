const admin = require("firebase-admin");
const serviceAccount = require("./src/config/serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function sample() {
    console.log("Sampling shops...");
    const snapshot = await db.collection("shops").limit(5).get();
    snapshot.docs.forEach(doc => {
        console.log(`- Shop: ${doc.data().name}, Fields: ${Object.keys(doc.data()).join(", ")}`);
        console.log(`  mall_id: ${doc.data().mall_id}, mallId: ${doc.data().mallId}`);
    });

    process.exit();
}

sample();
