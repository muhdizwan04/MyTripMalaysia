const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const DESTINATIONS = [
    { name: "Kuala Lumpur", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800" },
    { name: "Selangor", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1568603681498-844517228896?auto=format&fit=crop&w=800" },
    { name: "Penang", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1570533355208-166c3c434938?auto=format&fit=crop&w=800" },
    { name: "Melaka", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1629196883210-90c74ee34d90?auto=format&fit=crop&w=800" },
    { name: "Johor", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1590632501658-e3c3b0185994?auto=format&fit=crop&w=800" },
    { name: "Sabah", country: "Malaysia", image_url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800" }
];

const ATTRACTIONS = [
    // --- KUALA LUMPUR ---
    {
        name: "Petronas Twin Towers",
        description: "Tallest twin towers in the world and the iconic landmark of Malaysia.",
        state: "Kuala Lumpur",
        location_address: "KLCC, Kuala Lumpur",
        type: "Landmark",
        tags: ["landmark", "luxury", "must_visit", "city_view"],
        latitude: 3.1579,
        longitude: 101.7123,
        price_level: 4,
        rating: 4.8,
        price: 98,
        suggested_duration: 60,
        image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800"
    },
    {
        name: "Pavilion KL",
        description: "Award-winning shopping mall with an extensive range of luxury brands.",
        state: "Kuala Lumpur",
        location_address: "Bukit Bintang, Kuala Lumpur",
        type: "Mall",
        tags: ["shopping", "luxury", "aircon", "viral"],
        latitude: 3.1488,
        longitude: 101.7133,
        price_level: 4,
        rating: 4.9,
        price: 0,
        isMall: true,
        suggested_duration: 180,
        image_url: "https://images.unsplash.com/photo-1582234033100-8451f28b2656?auto=format&fit=crop&w=800"
    },
    {
        name: "Suria KLCC",
        description: "Premier shopping mall located at the foot of the Petronas Twin Towers.",
        state: "Kuala Lumpur",
        location_address: "Kuala Lumpur City Centre",
        type: "Mall",
        tags: ["shopping", "family", "aircon"],
        latitude: 3.1576,
        longitude: 101.7118,
        price_level: 3,
        rating: 4.7,
        price: 0,
        isMall: true,
        suggested_duration: 150,
        image_url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800"
    },
    {
        name: "Jalan Alor",
        description: "The most famous food street in Kuala Lumpur, offering unique street food.",
        state: "Kuala Lumpur",
        location_address: "Bukit Bintang, Kuala Lumpur",
        type: "Food",
        tags: ["street_food", "nightlife", "viral"],
        latitude: 3.1458,
        longitude: 101.7089,
        price_level: 2,
        rating: 4.5,
        price: 0,
        suggested_duration: 90,
        image_url: "https://images.unsplash.com/photo-1513470827771-4b6c3a6463f0?auto=format&fit=crop&w=800"
    },
    {
        name: "Saloma Link",
        description: "A beautiful pedestrian bridge that lights up at night.",
        state: "Kuala Lumpur",
        location_address: "Lorong Baru, Kampung Baru",
        type: "Landmark",
        tags: ["instagrammable", "nightlife", "free"],
        latitude: 3.1604,
        longitude: 101.7065,
        price_level: 1,
        rating: 4.6,
        price: 0,
        suggested_duration: 30,
        image_url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800"
    },
    {
        name: "Dataran Merdeka",
        description: "Historical square where Malaysia declared independence.",
        state: "Kuala Lumpur",
        location_address: "Jalan Raja, City Centre",
        type: "History",
        tags: ["history", "landmark", "free"],
        latitude: 3.1485,
        longitude: 101.6936,
        price_level: 1,
        rating: 4.6,
        price: 0,
        suggested_duration: 45,
        image_url: "https://images.unsplash.com/photo-1621334464104-fb7e60086c8a?auto=format&fit=crop&w=800"
    },
    {
        name: "Huckleberry",
        description: "Trendy viral cafe known for artisanal pastries and breakfast.",
        state: "Kuala Lumpur",
        location_address: "Plaza Damansara, KL",
        type: "Food",
        tags: ["cafe", "pastry", "viral", "halal"],
        latitude: 3.1580,
        longitude: 101.7120,
        price_level: 3,
        rating: 4.7,
        price: 45,
        suggested_duration: 60,
        image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800"
    },

    // --- SELANGOR ---
    {
        name: "Batu Caves",
        description: "A limestone hill that has a series of caves and cave temples.",
        state: "Selangor",
        location_address: "Gombak, Selangor",
        type: "Culture",
        tags: ["nature", "culture", "fitness", "must_visit"],
        latitude: 3.2379,
        longitude: 101.6840,
        price_level: 1,
        rating: 4.7,
        price: 0,
        suggested_duration: 120,
        image_url: "https://images.unsplash.com/photo-1568603681498-844517228896?auto=format&fit=crop&w=800"
    },
    {
        name: "Sunway Lagoon",
        description: "Multi-themed amusement and water park for total fun.",
        state: "Selangor",
        location_address: "Subang Jaya, Selangor",
        type: "Entertainment",
        tags: ["theme_park", "family", "adventure"],
        latitude: 3.0710,
        longitude: 101.6051,
        price_level: 5,
        rating: 4.6,
        price: 220,
        suggested_duration: 360,
        image_url: "https://images.unsplash.com/photo-1542823617-6cb566580998?auto=format&fit=crop&w=800"
    },
    {
        name: "Village Park Nasi Lemak",
        description: "The most famous Nasi Lemak in Malaysia, loved by locals and Prime Ministers.",
        state: "Selangor",
        location_address: "Damansara Utama, PJ",
        type: "Food",
        tags: ["halal", "food", "viral", "must_try"],
        latitude: 3.1349,
        longitude: 101.5947,
        price_level: 2,
        rating: 4.9,
        price: 25,
        suggested_duration: 60,
        image_url: "https://images.unsplash.com/photo-1626073456385-263d9154736f?auto=format&fit=crop&w=800"
    },
    {
        name: "Farm Fresh @ UPM",
        description: "A beautiful farm setting for fresh milk and family outings.",
        state: "Selangor",
        location_address: "Serdang, Selangor",
        type: "Nature",
        tags: ["nature", "family", "animals"],
        latitude: 2.9806,
        longitude: 101.7226,
        price_level: 2,
        rating: 4.6,
        price: 15,
        suggested_duration: 120,
        image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800"
    },
    {
        name: "I-City Shah Alam",
        description: "LED light city and theme park known for its nighttime beauty.",
        state: "Selangor",
        location_address: "Shah Alam, Selangor",
        type: "Entertainment",
        tags: ["nightlife", "family", "instagrammable"],
        latitude: 3.0648,
        longitude: 101.4853,
        price_level: 3,
        rating: 4.5,
        price: 80,
        suggested_duration: 180,
        image_url: "https://images.unsplash.com/photo-1513413157580-73895e631d87?auto=format&fit=crop&w=800"
    },

    // --- PENANG ---
    {
        name: "Penang Hill",
        description: "Cool air and breathtaking views of George Town from the peak.",
        state: "Penang",
        location_address: "Air Itam, Penang",
        type: "Nature",
        tags: ["nature", "view", "cool_weather", "family"],
        latitude: 5.4085,
        longitude: 100.2770,
        price_level: 3,
        rating: 4.7,
        price: 30,
        suggested_duration: 180,
        image_url: "https://images.unsplash.com/photo-1513413157580-73895e631d87?auto=format&fit=crop&w=800"
    },
    {
        name: "Kek Lok Si Temple",
        description: "Massive Buddhist temple complex with a giant statue of Kuan Yin.",
        state: "Penang",
        location_address: "Air Itam, Penang",
        type: "Culture",
        tags: ["culture", "history", "must_visit"],
        latitude: 5.3995,
        longitude: 100.2737,
        price_level: 1,
        rating: 4.8,
        price: 5,
        suggested_duration: 120,
        image_url: "https://images.unsplash.com/photo-1570533355208-166c3c434938?auto=format&fit=crop&w=800"
    },
    {
        name: "Teochew Chendul",
        description: "Iconic Penang Road dessert spot served in a traditional style.",
        state: "Penang",
        location_address: "Lebuh Keng Kwee, George Town",
        type: "Food",
        tags: ["dessert", "viral", "cheap", "halal"],
        latitude: 5.4172,
        longitude: 100.3307,
        price_level: 1,
        rating: 4.6,
        price: 5,
        suggested_duration: 30,
        image_url: "https://images.unsplash.com/photo-1626073456385-263d9154736f?auto=format&fit=crop&w=800"
    },
    {
        name: "Gurney Plaza",
        description: "George Town's premier lifestyle shopping destination.",
        state: "Penang",
        location_address: "Gurney Drive, Penang",
        type: "Mall",
        tags: ["shopping", "luxury", "aircon"],
        latitude: 5.4376,
        longitude: 100.3096,
        price_level: 4,
        rating: 4.7,
        price: 0,
        isMall: true,
        suggested_duration: 180,
        image_url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800"
    },
    {
        name: "Line Clear Nasi Kandar",
        description: "A legendary Nasi Kandar joint located in a narrow alley.",
        state: "Penang",
        location_address: "Penang Road, George Town",
        type: "Food",
        tags: ["food", "spicy", "mamak", "halal"],
        latitude: 5.4215,
        longitude: 100.3325,
        price_level: 2,
        rating: 4.4,
        price: 20,
        suggested_duration: 60,
        image_url: "https://images.unsplash.com/photo-1626073456385-263d9154736f?auto=format&fit=crop&w=800"
    },

    // --- MELAKA ---
    {
        name: "A Famosa",
        description: "Portuguese fortress ruins in the heart of the historical city.",
        state: "Melaka",
        location_address: "Jalan Kota, Melaka",
        type: "History",
        tags: ["history", "landmark", "must_visit"],
        latitude: 2.1924,
        longitude: 102.2494,
        price_level: 1,
        rating: 4.6,
        price: 0,
        suggested_duration: 45,
        image_url: "https://images.unsplash.com/photo-1629196883210-90c74ee34d90?auto=format&fit=crop&w=800"
    },
    {
        name: "Jonker Walk",
        description: "The center of Melaka's night market and antique shops.",
        state: "Melaka",
        location_address: "Jonker St, Melaka",
        type: "Culture",
        tags: ["shopping", "street_food", "nightlife", "culture"],
        latitude: 2.1956,
        longitude: 102.2475,
        price_level: 2,
        rating: 4.7,
        price: 0,
        suggested_duration: 120,
        image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800"
    },
    {
        name: "Chung Wah Chicken Rice Ball",
        description: "Melaka's signature chicken rice balls in a heritage setting.",
        state: "Melaka",
        location_address: "Jalan Hang Jebat, Melaka",
        type: "Food",
        tags: ["food", "non_halal", "famous", "must_try"],
        latitude: 2.1945,
        longitude: 102.2486,
        price_level: 2,
        rating: 4.5,
        price: 15,
        suggested_duration: 60,
        image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800"
    },

    // --- BONUS: JOHOR & SABAH ---
    {
        name: "Legoland Malaysia",
        description: "First Legoland theme park in Asia with rides and a water park.",
        state: "Johor",
        location_address: "Iskandar Puteri, Johor",
        type: "Entertainment",
        tags: ["theme_park", "lego", "family", "adventure"],
        latitude: 1.4271,
        longitude: 103.6299,
        price_level: 5,
        rating: 4.7,
        price: 249,
        suggested_duration: 480,
        image_url: "https://images.unsplash.com/photo-1531315630201-bb15fbeb8653?auto=format&fit=crop&w=800"
    },
    {
        name: "Mount Kinabalu",
        description: "The highest peak in Southeast Asia, heart of Mount Kinabalu National Park.",
        state: "Sabah",
        location_address: "Ranau, Sabah",
        type: "Nature",
        tags: ["adventure", "hiking", "nature", "landmark"],
        latitude: 6.0748,
        longitude: 116.5589,
        price_level: 5,
        rating: 4.9,
        price: 500,
        suggested_duration: 1440,
        image_url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800"
    }
];

const SHOPS = [
    { name: "% Arabica", description: "Viral Japanese Coffee", category: "Cafe", avgCost: 35, image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800" },
    { name: "Acne Studios", description: "Luxury Fashion", category: "Fashion", avgCost: 1500, image_url: "https://images.unsplash.com/photo-1539109139745-f600c715b3f4?auto=format&fit=crop&w=800" },
    { name: "Hai Di Lao", description: "Hotpot Service", category: "Food", avgCost: 120, image_url: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=800" },
    { name: "Golden Screen Cinemas", description: "Entertainment", category: "Entertainment", avgCost: 25, image_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800" }
];

async function seed() {
    try {
        console.log('🧹 Wiping existing data...');
        const collections = ['attractions', 'destinations', 'shops'];
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
        let pavilionId = null;
        for (const attr of ATTRACTIONS) {
            const payload = {
                ...attr,
                destinationId: destIds[attr.state] || ""
            };
            const docRef = await db.collection('attractions').add(payload);
            if (attr.name === "Pavilion KL") pavilionId = docRef.id;
            console.log(`- Seeded Attraction: ${attr.name}`);
        }

        if (pavilionId) {
            console.log('🌱 Seeding Shops for Pavilion KL...');
            for (const shop of SHOPS) {
                await db.collection('shops').add({
                    ...shop,
                    mallId: pavilionId
                });
                console.log(`- Seeded Shop: ${shop.name}`);
            }
        }

        console.log('✅ Mega Data Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding mega data:', error);
        process.exit(1);
    }
}

seed();
