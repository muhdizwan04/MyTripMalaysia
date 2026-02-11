const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const COLLECTIONS_TO_CLEAR = [
    'users',
    'destinations',
    'attractions',
    'shops',
    'hotels',
    'community_posts'
];

async function clearCollections() {
    console.log('🧹 Clearing collections...');
    for (const col of COLLECTIONS_TO_CLEAR) {
        const snapshot = await db.collection(col).get();
        if (snapshot.empty) {
            console.log(`- ${col} is already empty.`);
            continue;
        }

        console.log(`- Clearing ${snapshot.size} documents from ${col}...`);
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
    console.log('✨ All collections cleared.');
}

async function seedData() {
    try {
        await clearCollections();

        console.log('🌱 Seeding new data...');

        // 1. USER
        console.log('- Seeding User...');
        await db.collection('users').doc('john_traveler').set({
            username: "john_traveler",
            full_name: "John Traveler",
            bio: "Digital Nomad exploring Southeast Asia 🌏",
            profile_image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            stats: { trips: 14, posts: 32, followers: 1205 }
        });

        // 2. DESTINATIONS
        console.log('- Seeding Destinations...');
        const dests = [
            { id: 'kl', name: "Kuala Lumpur", description: "The energetic capital city.", image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80", lat: 3.1390, lng: 101.6869 },
            { id: 'penang', name: "Penang", description: "Food capital & heritage sites.", image_url: "https://images.unsplash.com/photo-1570533355208-166c3c434938?auto=format&fit=crop&w=800&q=80", lat: 5.4141, lng: 100.3288 },
            { id: 'sabah', name: "Sabah", description: "Nature, mountains & diving.", image_url: "https://images.unsplash.com/photo-1542823617-6cb566580998?auto=format&fit=crop&w=800&q=80", lat: 5.9788, lng: 116.0753 },
            { id: 'melaka', name: "Melaka", description: "Historical city & colonial charm.", image_url: "https://images.unsplash.com/photo-1629196883210-90c74ee34d90?auto=format&fit=crop&w=800&q=80", lat: 2.1896, lng: 102.2501 }
        ];

        for (const d of dests) {
            await db.collection('destinations').doc(d.id).set(d);
        }

        // 3. ATTRACTIONS
        console.log('- Seeding Attractions...');
        const attractions = [
            {
                name: "Batu Caves",
                description: "Iconic limestone caves.",
                type: "Nature",
                price: 0,
                rating: 4.8,
                image_url: "https://images.unsplash.com/photo-1568603681498-844517228896?auto=format&fit=crop&w=800",
                location: "Selangor",
                destinationId: "kl"
            },
            {
                name: "Petronas Twin Towers",
                description: "Tallest twin towers.",
                type: "Landmark",
                price: 85,
                rating: 4.9,
                image_url: "https://images.unsplash.com/photo-1533038692695-8e27f0528e1d?auto=format&fit=crop&w=800",
                location: "KL",
                destinationId: "kl"
            },
            {
                name: "Village Park Nasi Lemak",
                description: "Best Nasi Lemak in town.",
                type: "Food",
                price: 25,
                rating: 4.9,
                image_url: "https://images.unsplash.com/photo-1626073456385-263d9154736f?auto=format&fit=crop&w=800",
                location: "PJ",
                destinationId: "kl"
            },
            {
                name: "Pavilion KL",
                description: "Premier shopping destination.",
                type: "Mall",
                price: 0,
                rating: 4.8,
                image_url: "https://images.unsplash.com/photo-1582234033100-8451f28b2656?auto=format&fit=crop&w=800",
                location: "Bukit Bintang",
                is_mall: true,
                destinationId: "kl"
            }
        ];

        let pavilionId = '';
        for (const a of attractions) {
            const docRef = await db.collection('attractions').add(a);
            if (a.name === "Pavilion KL") {
                pavilionId = docRef.id;
            }
        }

        // 4. SHOPS
        console.log(`- Seeding Shops for Pavilion KL (${pavilionId})...`);
        const shops = [
            { name: "Zara", category: "Fashion", floor: "Level 3", image_url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800", mall_id: pavilionId },
            { name: "Apple Store", category: "Tech", floor: "Level 2", image_url: "https://images.unsplash.com/photo-1561524323-c5c742c0c7b2?auto=format&fit=crop&w=800", mall_id: pavilionId },
            { name: "Din Tai Fung", category: "Food", floor: "Level 1", image_url: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800", mall_id: pavilionId }
        ];

        for (const s of shops) {
            await db.collection('shops').add(s);
        }

        // 5. HOTELS
        console.log('- Seeding Hotels...');
        const hotels = [
            { name: "Grand Hyatt KL", type: "Luxury", price: 650, rating: 4.9, image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800", location: "KL" },
            { name: "Skyline Loft Airbnb", type: "Airbnb", price: 220, rating: 4.7, image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800", location: "KL" }
        ];

        for (const h of hotels) {
            await db.collection('hotels').add(h);
        }

        // 6. COMMUNITY FEED
        console.log('- Seeding Community Posts...');
        const posts = [
            {
                author: "Sarah Tan",
                content: "Finally tried the famous Nasi Lemak! 🍛",
                image_url: "https://images.unsplash.com/photo-1626073456385-263d9154736f?auto=format&fit=crop&w=800",
                likes: 234,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            },
            {
                author: "Mike Chen",
                content: "Sunset at the Twin Towers.",
                image_url: "https://images.unsplash.com/photo-1533038692695-8e27f0528e1d?auto=format&fit=crop&w=800",
                likes: 890,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            }
        ];

        for (const p of posts) {
            await db.collection('community_posts').add(p);
        }

        console.log('✅ Real Data Seeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
