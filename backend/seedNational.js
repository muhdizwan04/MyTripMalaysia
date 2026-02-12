const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const DESTINATIONS = [
    { name: "Kuala Lumpur", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800", description: "The capital city." },
    { name: "Selangor", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1568603681498-844517228896?auto=format&fit=crop&w=800", description: "Developed & Nature." },
    { name: "Penang", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1570533355208-166c3c434938?auto=format&fit=crop&w=800", description: "Food Capital." },
    { name: "Johor", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1590632501658-e3c3b0185994?auto=format&fit=crop&w=800", description: "Theme Parks & Islands." },
    { name: "Melaka", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1629196883210-90c74ee34d90?auto=format&fit=crop&w=800", description: "History." },
    { name: "Sabah", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800", description: "Nature & Diving." },
    { name: "Sarawak", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1598424268673-9eb170d18080?auto=format&fit=crop&w=800", description: "Culture & Caves." },
    { name: "Pahang", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1544945582-1dd27df81781?auto=format&fit=crop&w=800", description: "Highlands & Rainforests." },
    { name: "Perak", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1638334433121-7227d8940866?auto=format&fit=crop&w=800", description: "Heritage & Ipoh Food." },
    { name: "Kedah", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1582294154181-e2dd0616b3f7?auto=format&fit=crop&w=800", description: "Langkawi & Paddy Fields." },
    { name: "Terengganu", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1580879624515-52011b6c7ee9?auto=format&fit=crop&w=800", description: "Beaches & Islands." },
    { name: "Kelantan", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1623861214343-bc9713600494?auto=format&fit=crop&w=800", description: "Traditional Culture." },
    { name: "Negeri Sembilan", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1610472492652-5a2a11843336?auto=format&fit=crop&w=800", description: "Port Dickson Beaches." },
    { name: "Perlis", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1616854125867-b508753239c4?auto=format&fit=crop&w=800", description: "Nature." },
    { name: "Putrajaya", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1558716335-512cb5954625?auto=format&fit=crop&w=800", description: "Admin Centre & Architecture." },
    { name: "Labuan", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1565538960166-4191af83c317?auto=format&fit=crop&w=800", description: "Duty-Free Island." },
];

const ATTRACTIONS = [
    // --- PAHANG ---
    { name: "Cameron Highlands Tea Plantation", description: "Lush green tea plantations.", state: "Pahang", tags: ["nature", "cool_weather", "family"], rating: 4.8, type: "Nature", image_url: "https://images.unsplash.com/photo-1544945582-1dd27df81781?auto=format&fit=crop&w=800" },
    { name: "Genting SkyWorlds", description: "High-altitude theme park.", state: "Pahang", tags: ["theme_park", "cool_weather", "luxury"], price: 180, type: "Entertainment", image_url: "https://images.unsplash.com/photo-1695275659858-a5c92c8152c9?auto=format&fit=crop&w=800" },
    { name: "Taman Negara", description: "World's oldest tropical rainforest.", state: "Pahang", tags: ["adventure", "hiking", "rainforest"], price: 50, type: "Nature", image_url: "https://images.unsplash.com/photo-1579261012920-8041c2d0396c?auto=format&fit=crop&w=800" },

    // --- PERAK ---
    { name: "Concubine Lane", description: "Historical street with food and crafts.", state: "Perak", location: "Ipoh", tags: ["history", "viral_spot", "street_food"], type: "Culture", image_url: "https://images.unsplash.com/photo-1638334433121-7227d8940866?auto=format&fit=crop&w=800" },
    { name: "Kellie's Castle", description: "Unfinished mansion with mystery.", state: "Perak", tags: ["history", "photography", "spooky"], price: 10, type: "History", image_url: "https://images.unsplash.com/photo-1606830571171-897914092b3c?auto=format&fit=crop&w=800" },
    { name: "Lost World of Tambun", description: "Theme park and hot springs.", state: "Perak", tags: ["family", "water_park", "nature"], price: 110, type: "Entertainment", image_url: "https://images.unsplash.com/photo-1563720743-02f017409404?auto=format&fit=crop&w=800" },

    // --- KEDAH ---
    { name: "Langkawi Sky Bridge", description: "Curved pedestrian bridge above sea level.", state: "Kedah", tags: ["view", "adventure", "landmark"], price: 85, type: "Nature", image_url: "https://images.unsplash.com/photo-1510443209538-2321288e632e?auto=format&fit=crop&w=800" },
    { name: "Kilim Geoforest Park", description: "Mangrove tours and bat caves.", state: "Kedah", tags: ["boat_tour", "mangrove", "nature"], price: 250, type: "Nature", image_url: "https://images.unsplash.com/photo-1552554605-24c58f00259e?auto=format&fit=crop&w=800" },
    { name: "Dataran Lang (Eagle Square)", description: "Iconic eagle statue.", state: "Kedah", tags: ["landmark", "free", "photography"], type: "Landmark", image_url: "https://images.unsplash.com/photo-1582294154181-e2dd0616b3f7?auto=format&fit=crop&w=800" },

    // --- TERENGGANU ---
    { name: "Redang Island", description: "Pristine white sandy beaches.", state: "Terengganu", tags: ["beach", "diving", "luxury"], price: 0, type: "Nature", image_url: "https://images.unsplash.com/photo-1580879624515-52011b6c7ee9?auto=format&fit=crop&w=800" },
    { name: "Crystal Mosque", description: "Stunning mosque made of steel and glass.", state: "Terengganu", location: "Kuala Terengganu", tags: ["culture", "religion", "architecture"], type: "Culture", image_url: "https://images.unsplash.com/photo-1634626027103-6e2c39178f9f?auto=format&fit=crop&w=800" },

    // --- SARAWAK ---
    { name: "Gunung Mulu National Park", description: "Famous for its limestone karst formations.", state: "Sarawak", tags: ["caves", "adventure", "unesco"], price: 30, type: "Nature", image_url: "https://images.unsplash.com/photo-1598424268673-9eb170d18080?auto=format&fit=crop&w=800" },
    { name: "Sarawak Cultural Village", description: "Living museum of Sarawak's cultures.", state: "Sarawak", tags: ["history", "culture", "family"], price: 95, type: "Culture", image_url: "https://images.unsplash.com/photo-1627889392265-27f99995c721?auto=format&fit=crop&w=800" },

    // --- PUTRAJAYA ---
    { name: "Putra Mosque", description: "Pink-domed mosque by the water.", state: "Putrajaya", tags: ["architecture", "instagrammable", "free"], type: "Culture", image_url: "https://images.unsplash.com/photo-1558716335-512cb5954625?auto=format&fit=crop&w=800" },
    { name: "Putrajaya Botanical Garden", description: "Beautiful designed gardens.", state: "Putrajaya", tags: ["park", "cycling", "family"], type: "Nature", image_url: "https://images.unsplash.com/photo-1593414909831-294723023e21?auto=format&fit=crop&w=800" },

    // --- NEGERI SEMBILAN ---
    { name: "Port Dickson Army Museum", description: "Military history museum.", state: "Negeri Sembilan", tags: ["history", "military", "free"], type: "History", image_url: "https://images.unsplash.com/photo-1610472492652-5a2a11843336?auto=format&fit=crop&w=800" },
    { name: "Cape Rachado Lighthouse", description: "Historic lighthouse with sea views.", state: "Negeri Sembilan", tags: ["hiking", "view", "nature"], type: "Nature", image_url: "https://images.unsplash.com/photo-1590214849645-ec759902ac4d?auto=format&fit=crop&w=800" },

    // --- KELANTAN ---
    { name: "Siti Khadijah Market", description: "Central market famous for local produce.", state: "Kelantan", tags: ["culture", "shopping", "food"], type: "Shopping", image_url: "https://images.unsplash.com/photo-1623861214343-bc9713600494?auto=format&fit=crop&w=800" },
    { name: "Pantai Cahaya Bulan", description: "Popular beach for flying kites.", state: "Kelantan", tags: ["beach", "kite_flying", "street_food"], type: "Nature", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800" },

    // --- EXISTING BEST SELLERS (Re-inserted) ---
    // Kuala Lumpur
    { name: "Petronas Twin Towers", description: "Tallest twin towers in the world.", state: "Kuala Lumpur", tags: ["landmark", "luxury", "must_visit"], price: 98, type: "Landmark", image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800" },
    { name: "Pavilion KL", description: "Luxury shopping mall.", state: "Kuala Lumpur", tags: ["shopping", "luxury"], type: "Mall", isMall: true, image_url: "https://images.unsplash.com/photo-1582234033100-8451f28b2656?auto=format&fit=crop&w=800" },
    { name: "Batu Caves", description: "Limestone hill with cave temples.", state: "Selangor", tags: ["nature", "culture", "fitness"], type: "Culture", image_url: "https://images.unsplash.com/photo-1568603681498-844517228896?auto=format&fit=crop&w=800" },
    // Penang
    { name: "Penang Hill", description: "Breathtaking views.", state: "Penang", tags: ["nature", "view", "family"], type: "Nature", image_url: "https://images.unsplash.com/photo-1513413157580-73895e631d87?auto=format&fit=crop&w=800" },
    { name: "Teochew Chendul", description: "Famous dessert.", state: "Penang", tags: ["dessert", "food"], type: "Food", image_url: "https://images.unsplash.com/photo-1626073456385-263d9154736f?auto=format&fit=crop&w=800" },
    // Melaka
    { name: "A Famosa", description: "Portuguese fortress ruins.", state: "Melaka", tags: ["history", "landmark"], type: "History", image_url: "https://images.unsplash.com/photo-1629196883210-90c74ee34d90?auto=format&fit=crop&w=800" },
    // Johor
    { name: "Legoland Malaysia", description: "Theme park for families.", state: "Johor", tags: ["theme_park", "lego", "family"], price: 249, type: "Entertainment", image_url: "https://images.unsplash.com/photo-1531315630201-bb15fbeb8653?auto=format&fit=crop&w=800" },
    // Sabah
    { name: "Mount Kinabalu", description: "Highest peak in Borneo.", state: "Sabah", tags: ["adventure", "hiking", "nature"], price: 500, type: "Nature", image_url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800" }
];

async function seed() {
    try {
        console.log('🧹 Wiping existing data...');
        const collections = ['attractions', 'destinations'];
        for (const coll of collections) {
            const snapshot = await db.collection(coll).get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log(`- Cleared: ${coll}`);
        }

        console.log('🌱 Seeding Destinations...');
        const destIds = {};
        for (const dest of DESTINATIONS) {
            const docRef = await db.collection('destinations').add(dest);
            destIds[dest.name] = docRef.id;
            console.log(`- Seeded Destination: ${dest.name}`);
        }

        console.log('🌱 Seeding Attractions...');
        for (const attr of ATTRACTIONS) {
            const payload = {
                ...attr,
                destinationId: destIds[attr.state] || "",
                latitude: 0, // Default if not specified
                longitude: 0, // Default if not specified
                rating: attr.rating || 4.5, // Default good rating
                price: attr.price || 0,
                isMall: attr.isMall || false,
                isTrending: true, // Mark all as trending for now to populate lists
                createdAt: admin.firestore.Timestamp.now() // For sorting
            };
            await db.collection('attractions').add(payload);
            console.log(`- Seeded Attraction: ${attr.name}`);
        }

        console.log('✅ National Data Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding national data:', error);
        process.exit(1);
    }
}

seed();
