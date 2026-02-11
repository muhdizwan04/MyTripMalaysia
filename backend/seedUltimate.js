const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
// Assuming serviceAccountKey.json is in src/config/ as per seedFull.js
const serviceAccount = require('./src/config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedUltimateDatabase() {
    console.log('🌱 Starting ULTIMATE database seed...\n');

    try {
        // --- 1. Real User Profile ---
        console.log('👤 Seeding user profile...');
        await db.collection('users').doc('john_traveler').set({
            username: "johntraveler",
            full_name: "John Traveler",
            email: "john@mymalaysiatrip.com",
            bio: "Exploring Malaysia one state at a time 🇲🇾",
            profile_image: "https://i.pravatar.cc/150?u=john",
            counts: { trips: 12, posts: 8, saved: 24 }
        });
        console.log('✅ User seeded: john_traveler\n');


        // --- 2. Destinations ---
        console.log('📍 Seeding destinations...');
        const destinations = [
            { name: "Kuala Lumpur", description: "The vibrant capital city of Malaysia.", image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800", latitude: 3.1390, longitude: 101.6869 },
            { name: "Penang", description: "The food capital of Malaysia.", image_url: "https://images.unsplash.com/photo-1559142952-dbaa96df49a9?w=800", latitude: 5.4141, longitude: 100.3288 },
            { name: "Selangor", description: "Urban hubs and natural wonders.", image_url: "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?w=800", latitude: 3.0738, longitude: 101.5183 },
            { name: "Melaka", description: "Historical city with rich heritage.", image_url: "https://images.unsplash.com/photo-1568626601-38209848d792?w=800", latitude: 2.1896, longitude: 102.2501 },
            { name: "Langkawi", description: "Tropical paradise with stunning beaches.", image_url: "https://images.unsplash.com/photo-1528123287-6e60b1347918?w=800", latitude: 6.3500, longitude: 99.8000 },
            { name: "Sabah", description: "Home to Mount Kinabalu and wildlife.", image_url: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=800", latitude: 5.9788, longitude: 116.0753 },
            { name: "Sarawak", description: "Land of the Hornbills and rainforests.", image_url: "https://images.unsplash.com/photo-1602737671754-07d4b4a64303?w=800", latitude: 1.5533, longitude: 110.3592 },
            { name: "Johor", description: "Southern gateway with theme parks.", image_url: "https://images.unsplash.com/photo-1585937421612-70e008356f3a?w=800", latitude: 1.4927, longitude: 103.7414 },
            { name: "Pahang", description: "Cool highlands and ancient forests.", image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800", latitude: 3.8126, longitude: 103.3256 },
            { name: "Perak", description: "Limestone caves and colonial charm.", image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", latitude: 4.5921, longitude: 101.0901 }
        ];

        for (const dest of destinations) {
            await db.collection('destinations').doc(dest.name.toLowerCase().replace(/\s+/g, '_')).set(dest);
        }
        console.log('✅ Destinations seeded\n');


        // --- 3. Attractions ---
        console.log('🎯 Seeding attractions...');
        const attractions = [
            { name: "Batu Caves", type: "Nature", price: 0, rating: 4.6, location_name: "Selangor", latitude: 3.2379, longitude: 101.6840, image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800", description: "Iconic Hindu temple in limestone caves." },
            { name: "Petronas Twin Towers", type: "Landmark", price: 85, rating: 4.8, location_name: "Kuala Lumpur", latitude: 3.1579, longitude: 101.7123, image_url: "https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800", description: "World's tallest twin towers." },
            { name: "Sunway Lagoon", type: "Theme Park", price: 200, rating: 4.5, location_name: "Selangor", latitude: 3.0710, longitude: 101.6051, image_url: "https://images.unsplash.com/photo-1594385208974-2e75f8763c0e?w=800", description: "Multi-park theme park destination." },
            { name: "Village Park Nasi Lemak", type: "Food", price: 25, rating: 4.9, location_name: "Selangor", latitude: 3.1349, longitude: 101.5947, image_url: "https://images.unsplash.com/photo-1624518266248-3e134a972d7e?w=800", description: "Famous for its crispy fried chicken nasi lemak." },
            { name: "Kek Lok Si Temple", type: "Culture", price: 10, rating: 4.7, location_name: "Penang", latitude: 5.3995, longitude: 100.2737, image_url: "https://images.unsplash.com/photo-1559142952-dbaa96df49a9?w=800", description: "Largest Buddhist temple in Malaysia." },
            { name: "A Famosa", type: "History", price: 0, rating: 4.4, location_name: "Melaka", latitude: 2.1924, longitude: 102.2494, image_url: "https://images.unsplash.com/photo-1568626601-38209848d792?w=800", description: "Portuguese fortress ruins." },
            { name: "Langkawi Sky Bridge", type: "Nature", price: 60, rating: 4.8, location_name: "Langkawi", latitude: 6.3863, longitude: 99.6617, image_url: "https://images.unsplash.com/photo-1528123287-6e60b1347918?w=800", description: "Curved pedestrian bridge above the canopy." },
            { name: "Mount Kinabalu", type: "Nature", price: 400, rating: 4.9, location_name: "Sabah", latitude: 6.0748, longitude: 116.5589, image_url: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=800", description: "Highest mountain in Malaysia." },
            { name: "Pavilion KL", type: "Mall", price: 0, rating: 4.8, location_name: "Kuala Lumpur", latitude: 3.1488, longitude: 101.7133, is_mall: true, isMall: true, image_url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce2?w=800", description: "Premier shopping destination." },
            { name: "Jonker Street Night Market", type: "Culture", price: 0, rating: 4.6, location_name: "Melaka", latitude: 2.1956, longitude: 102.2475, image_url: "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?w=800", description: "Vibrant weekend night market." }
        ];

        let pavilionId = null;

        for (const attr of attractions) {
            const docRef = await db.collection('attractions').add(attr);
            if (attr.name === "Pavilion KL") {
                pavilionId = docRef.id;
                console.log(`✅ Pavilion KL ID verified: ${pavilionId}`);
            }
        }
        console.log('✅ Attractions seeded\n');


        // --- 4. Hotels ---
        console.log('🏨 Seeding hotels...');
        const hotels = [
            { name: "Grand Hyatt KL", type: "Luxury", price: 650, rating: 4.8, location_name: "Kuala Lumpur", latitude: 3.1532, longitude: 101.7104, image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" },
            { name: "Skyline Loft KLCC", type: "Airbnb", price: 250, rating: 4.9, location_name: "Kuala Lumpur", latitude: 3.1600, longitude: 101.7150, image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800" },
            { name: "Budget Inn Melaka", type: "Budget", price: 80, rating: 3.5, location_name: "Melaka", latitude: 2.1900, longitude: 102.2500, image_url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800" },
            { name: "Shangri-La Rasa Sayang", type: "Resort", price: 800, rating: 4.8, location_name: "Penang", latitude: 5.4785, longitude: 100.2520, image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800" }, // Lat/Lng approximated for Penang resort
            { name: "The Datai Langkawi", type: "Luxury", price: 1200, rating: 4.9, location_name: "Langkawi", latitude: 6.4256, longitude: 99.6679, image_url: "https://images.unsplash.com/photo-1571896349842-68c242f9ed84?w=800" },
            { name: "Heritage Shophouse", type: "Airbnb", price: 180, rating: 4.6, location_name: "Penang", latitude: 5.4192, longitude: 100.3378, image_url: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=800" },
            { name: "Capsule Hotel KLIA2", type: "Budget", price: 100, rating: 4.2, location_name: "Sepang", latitude: 2.7433, longitude: 101.6981, image_url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800" },
            { name: "Avillion Port Dickson", type: "Resort", price: 400, rating: 4.4, location_name: "Port Dickson", latitude: 2.4965, longitude: 101.8385, image_url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800" },
            { name: "Rainforest Treehouse", type: "Nature", price: 150, rating: 4.5, location_name: "Johor", latitude: 1.5898, longitude: 103.5135, image_url: "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?w=800" },
            { name: "Genting World Hotel", type: "Hotel", price: 300, rating: 4.3, location_name: "Genting", latitude: 3.4241, longitude: 101.7928, image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800" }
        ];

        for (const hotel of hotels) {
            await db.collection('hotels').add(hotel);
        }
        console.log('✅ Hotels seeded\n');


        // --- 5. Community Feed ---
        console.log('👥 Seeding community feed...');
        const posts = [
            { author: "John Traveler", author_avatar: "https://i.pravatar.cc/150?u=john", location: "Village Park Nasi Lemak", image_url: "https://images.unsplash.com/photo-1624518266248-3e134a972d7e?w=800", caption: "Best Nasi Lemak!", likes: 120, timestamp: admin.firestore.Timestamp.now() },
            { author: "Ahmad Razak", author_avatar: "https://i.pravatar.cc/150?u=ahmad", location: "Sabah", image_url: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=800", caption: "Hiking Mount Kinabalu!", likes: 85, timestamp: admin.firestore.Timestamp.now() },
            { author: "Mei Ling", author_avatar: "https://i.pravatar.cc/150?u=mei", location: "Pavilion KL", image_url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce2?w=800", caption: "Shopping spree at Pavilion!", likes: 200, timestamp: admin.firestore.Timestamp.now() },
            { author: "Raj Kumar", author_avatar: "https://i.pravatar.cc/150?u=raj", location: "A Famosa", image_url: "https://images.unsplash.com/photo-1568626601-38209848d792?w=800", caption: "Historical walk in Melaka.", likes: 95, timestamp: admin.firestore.Timestamp.now() },
            { author: "Jessica Lee", author_avatar: "https://i.pravatar.cc/150?u=jessica", location: "Langkawi Sky Bridge", image_url: "https://images.unsplash.com/photo-1528123287-6e60b1347918?w=800", caption: "Sunset at Langkawi.", likes: 150, timestamp: admin.firestore.Timestamp.now() },
            // Generic posts
            { author: "Sarah Tan", author_avatar: "https://i.pravatar.cc/150?u=sarah", location: "Penang", image_url: "https://images.unsplash.com/photo-1559142952-dbaa96df49a9?w=800", caption: "Love the food here!", likes: 300, timestamp: admin.firestore.Timestamp.now() },
            { author: "David Wong", author_avatar: "https://i.pravatar.cc/150?u=david", location: "Kuala Lumpur", image_url: "https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800", caption: "Twin Towers at night.", likes: 220, timestamp: admin.firestore.Timestamp.now() },
            { author: "Lisa Chen", author_avatar: "https://i.pravatar.cc/150?u=lisa", location: "Batu Caves", image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800", caption: "Beautiful colors!", likes: 180, timestamp: admin.firestore.Timestamp.now() },
            { author: "Ali Hassan", author_avatar: "https://i.pravatar.cc/150?u=ali", location: "Ipoh", image_url: "https://images.unsplash.com/photo-1519890656096-7c050212003c?w=800", caption: "Old town vibes.", likes: 110, timestamp: admin.firestore.Timestamp.now() },
            { author: "Nina Patel", author_avatar: "https://i.pravatar.cc/150?u=nina", location: "Cameron Highlands", image_url: "https://images.unsplash.com/photo-1589136777351-9c61253eeb83?w=800", caption: "Tea plantations 🍵", likes: 250, timestamp: admin.firestore.Timestamp.now() }
        ];

        for (const post of posts) {
            await db.collection('community_posts').add(post);
        }
        console.log('✅ Community feed seeded\n');


        // --- 6. Malls & Shops (Linked) ---
        if (pavilionId) {
            console.log(`🛍️  Seeding shops for Pavilion KL (${pavilionId})...`);
            const shops = [
                { name: "Zara", category: "Fashion", floor_level: "Ground Floor", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600", rating: 4.5 },
                { name: "Uniqlo", category: "Fashion", floor_level: "Level 1", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600", rating: 4.6 },
                { name: "H&M", category: "Fashion", floor_level: "Level 1", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600", rating: 4.4 },
                { name: "Padini", category: "Fashion", floor_level: "Level 2", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600", rating: 4.3 },
                { name: "Apple", category: "Electronics", floor_level: "Level 2", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1592286927505-2fd0f8a196e0?w=600", rating: 4.9 },
                { name: "Samsung", category: "Electronics", floor_level: "Level 2", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1610457167756-ad4b6b15d9a8?w=600", rating: 4.7 },
                { name: "Din Tai Fung", category: "Food", floor_level: "Level 6", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600", rating: 4.8 },
                { name: "Madam Kwan's", category: "Food", floor_level: "Level 1", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1624518266248-3e134a972d7e?w=600", rating: 4.6 },
                { name: "Sephora", category: "Beauty", floor_level: "Level 3", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600", rating: 4.8 },
                { name: "Golden Screen Cinemas", category: "Entertainment", floor_level: "Level 5", mallId: pavilionId, image_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600", rating: 4.7 }
            ];

            for (const shop of shops) {
                // Ensure field names match requirement (category, floor_level, mall_id)
                // Note: user asked for "mall_id" in requirement text but used "mallId" in previous schemas. 
                // I will include BOTH or ensure consistency. Let's use mallId as per seedFull.js example but add mall_id too for safety if user logic changed.
                // Re-reading user request: "Fields: name, category, floor_level, mall_id". 
                // I will use `mallId` AND `mall_id` to be safe and `floor` as well since MallDetailsPage uses `floor`.
                await db.collection('shops').add({
                    ...shop,
                    mall_id: pavilionId,
                    floor: shop.floor_level // mapping floor_level to floor for frontend compatibility
                });
            }
            console.log('✅ Shops seeded\n');
        } else {
            console.log('⚠️ Pavilion KL not found, skipping shops seeding.');
        }

        console.log('🎉 ✅ Database Seeded Successfully');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
    process.exit(0);
}

seedUltimateDatabase();
