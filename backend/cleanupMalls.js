const admin = require("firebase-admin");
const serviceAccount = require("./src/config/serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function cleanup() {
    console.log("Cleaning up duplicate 'Suria KLCC'...");
    const snapshot = await db.collection("attractions")
        .where("name", "==", "Suria KLCC")
        .where("type", "==", "Mall")
        .get();

    for (const doc of snapshot.docs) {
        // Check if this mall has shops
        const shopsSnapshot = await db.collection("shops").where("mall_id", "==", doc.id).get();
        if (shopsSnapshot.empty) {
            console.log(`Deleting empty mall: ${doc.id} (${doc.data().name})`);
            await db.collection("attractions").doc(doc.id).delete();
        } else {
            console.log(`Keeping mall with shops: ${doc.id} (${doc.data().name})`);
        }
    }

    process.exit();
}

cleanup();
