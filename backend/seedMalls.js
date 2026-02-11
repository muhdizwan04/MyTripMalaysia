const admin = require("firebase-admin");
const serviceAccount = require("./src/config/serviceAccountKey.json");

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const MALLS = [
    {
        name: "Suria KLCC",
        type: "Mall",
        location: "Kuala Lumpur",
        image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800",
        rating: 4.8,
        description: "Premier shopping destination at the base of the Petronas Twin Towers."
    },
    {
        name: "Mid Valley Megamall",
        type: "Mall",
        location: "Kuala Lumpur",
        image_url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800",
        rating: 4.6,
        description: "One of the largest shopping malls in Southeast Asia."
    }
];

const SHOPS = {
    "Suria KLCC": [
        { name: "Nike", category: "Fashion", floor: "Level 1", image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400" },
        { name: "Isetan", category: "Departmental", floor: "Multiple", image_url: "https://images.unsplash.com/photo-1519500099198-c185fba3b7e5?q=80&w=400" },
        { name: "Sephora", category: "Beauty", floor: "Ground Floor", image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400" },
        { name: "Signatures Food Court", category: "Food", floor: "Level 2", image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?q=80&w=400" },
        { name: "Apple Store", category: "Tech", floor: "Level 1", image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba30a8?q=80&w=400" }
    ],
    "Mid Valley Megamall": [
        { name: "Uniqlo", category: "Fashion", floor: "Level 1", image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400" },
        { name: "MPH Bookstores", category: "Books", floor: "Level 2", image_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400" },
        { name: "Golden Screen Cinemas", category: "Entertainment", floor: "Level 3", image_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400" },
        { name: "Dragon-i", category: "Food", floor: "Level 1", image_url: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=400" },
        { name: "Harvey Norman", category: "Electronics", floor: "Level 3", image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400" }
    ]
};

async function seedMalls() {
    console.log("🚀 Starting Mall & Shop Seed...");

    try {
        // Optional: Clear existing shops and malls to avoid duplicates in testing
        // For production, we would usually just add.

        for (const mallData of MALLS) {
            console.log(`Creating Mall: ${mallData.name}`);
            const mallRef = await db.collection("attractions").add(mallData);
            const mallId = mallRef.id;

            const shops = SHOPS[mallData.name];
            for (const shopData of shops) {
                console.log(`  Creating Shop: ${shopData.name} for Mall: ${mallId}`);
                await db.collection("shops").add({
                    ...shopData,
                    mall_id: mallId
                });
            }
        }

        console.log("🎉 Seed completed successfully!");
    } catch (error) {
        console.error("❌ Seed failed:", error);
    } finally {
        process.exit();
    }
}

seedMalls();
