const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Check if firebase is already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function seedDatabase() {
    console.log("🚀 Starting database seed...");

    // 1. Users
    const usersRef = db.collection('users');
    await usersRef.doc('john_traveler').set({
        username: 'johntraveler',
        full_name: 'John Traveler',
        bio: 'Exploring Malaysia one state at a time 🇲🇾',
        counts: { trips: 12, posts: 8, saved: 24 },
        profile_image: 'https://i.pravatar.cc/150?u=john'
    });
    console.log("✅ User John added");

    // 2. Attractions
    const attractionsRef = db.collection('attractions');
    await attractionsRef.add({
        name: 'Village Park Restaurant',
        rating: 4.8,
        review_count: 1245,
        type: 'Viral Food',
        location: 'Petaling Jaya, Selangor',
        description: 'Best nasi lemak in KL! The sambal is perfectly spicy.',
        ticket_price: 25.00,
        image_url: 'https://placehold.co/600x400/orange/white?text=Nasi+Lemak'
    });

    // 3. Malls & Shops
    const mallsRef = db.collection('attractions'); // Malls are also attractions
    const pavilionRef = await mallsRef.add({
        name: 'Pavilion KL',
        rating: 4.8,
        type: 'Luxury Mall',
        location: 'Bukit Bintang, KL',
        is_mall: true,
        description: 'Premier shopping destination.'
    });

    const shopsRef = db.collection('shops');
    await shopsRef.add({
        mall_id: pavilionRef.id,
        name: 'Zara',
        floor_level: 'Ground Floor',
        category: 'Fashion'
    });
    console.log("✅ Pavilion Mall & Zara added");

    console.log("🏁 Database seeded successfully!");
}

seedDatabase().catch(console.error);
