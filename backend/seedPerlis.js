const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const perlisSpots = [
    {
        name: "Warung Tepi Sawah",
        type: "food",
        category: "Local Food",
        state: "Perlis",
        location_address: "Jalan Tuanku Syed Sirajuddin, Arau, Perlis",
        latitude: 6.4333,
        longitude: 100.2667,
        image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc18593",
        price: 15,
        suggested_duration: 60,
        description: "Famous for its scenic paddy field views and authentic Perlis breakfast.",
        tags: ["local_food", "halal_food", "scenic"],
        rating: 4.8
    },
    {
        name: "Gua Kelam",
        type: "nature",
        category: "Nature/Relax",
        state: "Perlis",
        location_address: "Kaki Bukit, Perlis",
        latitude: 6.6436,
        longitude: 100.2031,
        image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        price: 5,
        suggested_duration: 120,
        description: "A 370-meter long limestone cave known for its 'cave walk' and historical tin mining.",
        tags: ["nature", "adventure", "history"],
        rating: 4.6
    },
    {
        name: "Wang Kelian View",
        type: "nature",
        category: "Nature/Relax",
        state: "Perlis",
        location_address: "Wang Kelian, Perlis",
        latitude: 6.6789,
        longitude: 100.1894,
        image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        price: 0,
        suggested_duration: 90,
        description: "Stunning panoramic views of the Malaysia-Thailand border and early morning mist.",
        tags: ["nature", "scenic", "viral_spot"],
        rating: 4.7
    }
];

async function seedPerlis() {
    console.log('🌱 Seeding Perlis data...');
    const destinationsRef = db.collection('destinations');
    const attractionsRef = db.collection('attractions');

    // 1. Ensure Perlis destination exists
    const perlisShot = await destinationsRef.where('name', '==', 'Perlis').get();
    let perlisId;
    if (perlisShot.empty) {
        const doc = await destinationsRef.add({
            name: 'Perlis',
            image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc18593",
            description: "The smallest state in Malaysia, known for its tranquil nature and paddy fields."
        });
        perlisId = doc.id;
    } else {
        perlisId = perlisShot.docs[0].id;
    }

    // 2. Add attractions
    for (const spot of perlisSpots) {
        const spotWithDestId = { ...spot, destinationId: perlisId };
        const innerShot = await attractionsRef.where('name', '==', spot.name).get();
        if (innerShot.empty) {
            await attractionsRef.add(spotWithDestId);
            console.log(`✅ Added: ${spot.name}`);
        } else {
            console.log(`⏩ Skipping (exists): ${spot.name}`);
        }
    }
    console.log('🏁 Seeding complete!');
    process.exit();
}

seedPerlis().catch(err => {
    console.error('❌ Error seeding:', err);
    process.exit(1);
});
