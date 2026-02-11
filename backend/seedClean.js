const admin = require("firebase-admin");
const serviceAccount = require("./src/config/serviceAccountKey.json");

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

// --- Golden Data ---

const ATTRACTIONS = [
    {
        name: "Petronas Twin Towers",
        type: "Landmark",
        description: "The world's tallest twin towers.",
        price: 80,
        rating: 4.8,
        location: "Kuala Lumpur",
        latitude: 3.15785,
        longitude: 101.712,
        image_url: "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?q=80&w=800",
        is_trending: true,
        is_must_visit: true,
        is_mall: false
    },
    {
        name: "Batu Caves",
        type: "Nature",
        description: "Limestone hill with a series of caves and cave temples.",
        price: 0,
        rating: 4.7,
        location: "Gombak",
        latitude: 3.23788,
        longitude: 101.684,
        image_url: "https://images.unsplash.com/photo-1601931846461-9c16b64f9814?q=80&w=800",
        is_trending: true,
        is_must_visit: true,
        is_mall: false
    },
    {
        name: "Pavilion KL",
        type: "Mall",
        description: "Premier shopping destination in Bukit Bintang.",
        price: 0,
        rating: 4.6,
        location: "Bukit Bintang",
        latitude: 3.1485,
        longitude: 101.713,
        image_url: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=800",
        is_trending: true,
        is_mall: true
    },
    {
        name: "Village Park Restaurant",
        type: "Food",
        description: "Famous for its Nasi Lemak and Fried Chicken.",
        price: 15,
        rating: 4.9,
        location: "Damansara Uptown",
        latitude: 3.1349,
        longitude: 101.629,
        image_url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Nasi_Lemak_Village_Park.jpg",
        is_trending: false,
        is_mall: false
    },
    {
        name: "Sunway Pyramid",
        type: "Mall",
        description: "Egyptian-themed shopping mall with an ice rink.",
        price: 0,
        rating: 4.7,
        location: "Subang Jaya",
        latitude: 3.0733,
        longitude: 101.607,
        image_url: "https://images.unsplash.com/photo-1582260654060-d2c676233547?q=80&w=800",
        is_trending: false,
        is_mall: true
    },
    {
        name: "Aquaria KLCC",
        type: "Nature",
        description: "Oceanarium located beneath KL Convention Centre.",
        price: 65,
        rating: 4.5,
        location: "Kuala Lumpur",
        latitude: 3.1537,
        longitude: 101.713,
        image_url: "https://images.unsplash.com/photo-1540959733305-ad92bc568d40?q=80&w=800",
        is_trending: false,
        is_mall: false
    },
    {
        name: "Jalan Alor",
        type: "Food",
        description: "Famous street food night market.",
        price: 30,
        rating: 4.4,
        location: "Bukit Bintang",
        latitude: 3.1459,
        longitude: 101.709,
        image_url: "https://images.unsplash.com/photo-1577457805448-96f131102941?q=80&w=800",
        is_trending: false,
        is_mall: false
    },
    {
        name: "KL Bird Park",
        type: "Nature",
        description: "World's largest free-flight walk-in aviary.",
        price: 45,
        rating: 4.3,
        location: "Kuala Lumpur",
        latitude: 3.1432,
        longitude: 101.688,
        image_url: "https://images.unsplash.com/photo-1452570053594-1b985d6ea218?q=80&w=800",
        is_trending: false,
        is_mall: false
    },
    {
        name: "Suria KLCC",
        type: "Mall",
        description: "Luxury shopping at the foot of Petronas Towers.",
        price: 0,
        rating: 4.7,
        location: "Kuala Lumpur",
        latitude: 3.1575,
        longitude: 101.711,
        image_url: "https://images.unsplash.com/photo-1519575193086-66f8090f77b7?q=80&w=800",
        is_trending: false,
        is_mall: true
    },
    {
        name: "Kek Lok Si Temple",
        type: "Culture",
        description: "Largest Buddhist temple in Malaysia.",
        price: 0,
        rating: 4.8,
        location: "Penang",
        latitude: 5.4002,
        longitude: 100.278,
        image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800",
        is_trending: false,
        is_must_visit: true,
        is_mall: false
    }
];

const ITINERARIES = [
    {
        title: "Foodie's Paradise",
        days: 3,
        price: 500,
        type: "Culinary",
        image_url: "https://images.unsplash.com/photo-1615556276228-406567228a6f?q=80&w=800"
    },
    {
        title: "Heritage Walk",
        days: 2,
        price: 200,
        type: "Culture",
        image_url: "https://images.unsplash.com/photo-1594950346062-7206b0d9b4b0?q=80&w=800"
    },
    {
        title: "Nature Escape",
        days: 4,
        price: 800,
        type: "Nature",
        image_url: "https://images.unsplash.com/photo-1439246854758-f686a415d98b?q=80&w=800"
    },
    {
        title: "City Lights",
        days: 2,
        price: 450,
        type: "Urban",
        image_url: "https://images.unsplash.com/photo-1473186531569-b5266b0a887b?q=80&w=800"
    }
];

// --- Seed Function ---

async function seedClean() {
    console.log("🚀 Starting clean seed...");

    try {
        // 1. Wipe Collections
        await deleteCollection("attractions");
        await deleteCollection("itineraries");
        console.log("✅ Cleared old data.");

        // 2. Insert Attractions
        const attractionPromises = ATTRACTIONS.map(item => {
            return db.collection("attractions").add(item);
        });
        await Promise.all(attractionPromises);
        console.log(`✅ Inserted ${ATTRACTIONS.length} attractions.`);

        // 3. Insert Itineraries
        const itineraryPromises = ITINERARIES.map(item => {
            return db.collection("itineraries").add(item);
        });
        await Promise.all(itineraryPromises);
        console.log(`✅ Inserted ${ITINERARIES.length} itineraries.`);

        console.log("🎉 Seed completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

// Helper to delete all documents in a collection
async function deleteCollection(collectionPath) {
    const batchSize = 100;
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

seedClean();
