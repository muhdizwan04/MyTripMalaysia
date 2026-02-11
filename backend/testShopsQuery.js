const admin = require("firebase-admin");
const serviceAccount = require("./src/config/serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function testApi() {
    const mallId = "uzSCkjRcCxTVJlIrBTl1"; // Suria KLCC (the one I seeded)
    console.log(`Testing shops for mall_id: ${mallId}`);

    // Simulate shopService.getAllShops(mallId)
    const snapshot = await db.collection("shops").where("mall_id", "==", mallId).get();
    console.log(`Found ${snapshot.size} shops`);
    snapshot.docs.forEach(doc => {
        console.log(`- ${doc.data().name} (${doc.data().category}, ${doc.data().floor})`);
    });

    process.exit();
}

testApi();
