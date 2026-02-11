const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const ATTRACTIONS = [
    {
        name: "Petronas Twin Towers",
        description: "Tallest twin towers in the world.",
        type: "Landmark",
        location: "KL City Centre",
        destinationId: "kl",
        tags: ["landmark", "luxury", "city_view"],
        latitude: 3.1579,
        longitude: 101.7123,
        suggested_duration: 60,
        price_level: 4,
        opening_hours: "09:00 - 21:00",
        rating: 4.8,
        price: 98,
        image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800"
    },
    {
        name: "Batu Caves",
        description: "A limestone hill that has a series of caves and cave temples.",
        type: "Cultural",
        location: "Gombak",
        destinationId: "kl",
        tags: ["nature", "cultural", "temple", "viral_spot"],
        latitude: 3.2379,
        longitude: 101.6840,
        suggested_duration: 120,
        price_level: 1,
        opening_hours: "07:00 - 19:00",
        rating: 4.7,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1568603681498-844517228896?auto=format&fit=crop&w=800"
    },
    {
        name: "Village Park Nasi Lemak",
        description: "Legendary Nasi Lemak in Damansara Utama.",
        type: "Food",
        location: "Petaling Jaya",
        destinationId: "kl",
        tags: ["viral_spot", "local_food", "halal_food"],
        latitude: 3.1349,
        longitude: 101.5947,
        suggested_duration: 60,
        price_level: 2,
        opening_hours: "06:30 - 17:30",
        rating: 4.9,
        price: 25,
        image_url: "https://images.unsplash.com/photo-1626073456385-263d9154736f?auto=format&fit=crop&w=800"
    },
    {
        name: "Sunway Lagoon",
        description: "Multi-themed amusement and water park.",
        type: "Entertainment",
        location: "Subang Jaya",
        destinationId: "kl",
        tags: ["theme_park", "family_friendly", "adventure"],
        latitude: 3.0710,
        longitude: 101.6051,
        suggested_duration: 360,
        price_level: 5,
        opening_hours: "10:00 - 18:00",
        rating: 4.6,
        price: 220,
        image_url: "https://images.unsplash.com/photo-1542823617-6cb566580998?auto=format&fit=crop&w=800"
    },
    {
        name: "Jalan Alor Night Market",
        description: "The heart of street food in KL.",
        type: "Food",
        location: "Bukit Bintang",
        destinationId: "kl",
        tags: ["street_food", "nightlife", "viral_spot"],
        latitude: 3.1458,
        longitude: 101.7089,
        suggested_duration: 90,
        price_level: 2,
        opening_hours: "17:00 - 02:00",
        rating: 4.5,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1513470827771-4b6c3a6463f0?auto=format&fit=crop&w=800"
    },
    {
        name: "Kek Lok Si Temple",
        description: "Largest Buddhist temple in Malaysia.",
        type: "Cultural",
        location: "Air Itam",
        destinationId: "penang",
        tags: ["cultural", "temple", "heritage", "landmark"],
        latitude: 5.3996,
        longitude: 100.2736,
        suggested_duration: 120,
        price_level: 1,
        opening_hours: "08:30 - 17:30",
        rating: 4.8,
        price: 5,
        image_url: "https://images.unsplash.com/photo-1570533355208-166c3c434938?auto=format&fit=crop&w=800"
    },
    {
        name: "A Famosa",
        description: "Portuguese fortress in Malacca.",
        type: "History",
        location: "Melaka City",
        destinationId: "melaka",
        tags: ["historical", "landmark", "cultural"],
        latitude: 2.1920,
        longitude: 102.2505,
        suggested_duration: 45,
        price_level: 1,
        opening_hours: "24 Hours",
        rating: 4.6,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1629196883210-90c74ee34d90?auto=format&fit=crop&w=800"
    },
    {
        name: "Pavilion KL",
        description: "Luxury shopping mall in Bukit Bintang.",
        type: "Shopping",
        location: "Bukit Bintang",
        destinationId: "kl",
        tags: ["shopping", "luxury", "viral_spot"],
        latitude: 3.1488,
        longitude: 101.7135,
        suggested_duration: 180,
        price_level: 4,
        opening_hours: "10:00 - 22:00",
        rating: 4.9,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1582234033100-8451f28b2656?auto=format&fit=crop&w=800",
        isMall: true
    },
    {
        name: "KL Forest Eco Park",
        description: "Tropical rainforest in the heart of the city.",
        type: "Nature",
        location: "KL City Centre",
        destinationId: "kl",
        tags: ["nature", "family_friendly", "adventure"],
        latitude: 3.1508,
        longitude: 101.7001,
        suggested_duration: 60,
        price_level: 2,
        opening_hours: "08:00 - 18:00",
        rating: 4.4,
        price: 40,
        image_url: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=800"
    },
    {
        name: "Jonker Street Night Market",
        description: "Famous weekend night market in Malacca.",
        type: "Food",
        location: "Melaka City",
        destinationId: "melaka",
        tags: ["street_food", "cultural", "viral_spot", "heritage"],
        latitude: 2.1951,
        longitude: 102.2457,
        suggested_duration: 120,
        price_level: 2,
        opening_hours: "18:00 - 00:00 (Fri-Sun)",
        rating: 4.7,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800"
    },
    {
        name: "George Town Street Art",
        description: "Interactive murals across the heritage city.",
        type: "Cultural",
        location: "George Town",
        destinationId: "penang",
        tags: ["cultural", "viral_spot", "heritage", "photography"],
        latitude: 5.4141,
        longitude: 100.3400,
        suggested_duration: 90,
        price_level: 1,
        opening_hours: "24 Hours",
        rating: 4.6,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800"
    },
    {
        name: "Perdana Botanical Garden",
        description: "Vast recreational park and botanical gardens.",
        type: "Nature",
        location: "Tasik Perdana",
        destinationId: "kl",
        tags: ["nature", "family_friendly", "relaxing"],
        latitude: 3.1432,
        longitude: 101.6852,
        suggested_duration: 120,
        price_level: 1,
        opening_hours: "07:00 - 20:00",
        rating: 4.6,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800"
    },
    {
        name: "Thean Hou Temple",
        description: "Six-tiered Chinese temple in KL.",
        type: "Cultural",
        location: "Seputeh",
        destinationId: "kl",
        tags: ["cultural", "temple", "photography", "viral_spot"],
        latitude: 3.1214,
        longitude: 101.6868,
        suggested_duration: 60,
        price_level: 1,
        opening_hours: "08:00 - 20:00",
        rating: 4.8,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1568603681498-844517228896?auto=format&fit=crop&w=800"
    },
    {
        name: "Genting SkyWorlds",
        description: "Outdoor theme park at 6,000 feet altitude.",
        type: "Entertainment",
        location: "Genting Highlands",
        destinationId: "kl",
        tags: ["theme_park", "family_friendly", "adventure", "luxury"],
        latitude: 3.4244,
        longitude: 101.7946,
        suggested_duration: 480,
        price_level: 5,
        opening_hours: "11:00 - 18:00",
        rating: 4.7,
        price: 189,
        image_url: "https://images.unsplash.com/photo-1513413157580-73895e631d87?auto=format&fit=crop&w=800"
    },
    {
        name: "Sekinchan Paddy Fields",
        description: "Vibrant green paddy fields and fishing village.",
        type: "Nature",
        location: "Sekinchan",
        destinationId: "kl",
        tags: ["nature", "photography", "viral_spot"],
        latitude: 3.5042,
        longitude: 101.1042,
        suggested_duration: 120,
        price_level: 1,
        opening_hours: "24 Hours",
        rating: 4.6,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800"
    },
    {
        name: "National Museum",
        description: "Historical treasures of Malaysia.",
        type: "History",
        location: "Tasik Perdana",
        destinationId: "kl",
        tags: ["cultural", "historical", "educational"],
        latitude: 3.1376,
        longitude: 101.6876,
        suggested_duration: 90,
        price_level: 1,
        opening_hours: "09:00 - 17:00",
        rating: 4.5,
        price: 5,
        image_url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800"
    },
    {
        name: "Petaling Street Market",
        description: "The original Chinatown of KL.",
        type: "Shopping",
        location: "City Centre",
        destinationId: "kl",
        tags: ["street_food", "shopping", "cultural"],
        latitude: 3.1438,
        longitude: 101.6974,
        suggested_duration: 90,
        price_level: 2,
        opening_hours: "10:00 - 21:00",
        rating: 4.4,
        price: 0,
        image_url: "https://images.unsplash.com/photo-1513470827771-4b6c3a6463f0?auto=format&fit=crop&w=800"
    },
    {
        name: "Skytrex Adventure",
        description: "Tree-top obstacle course in Shah Alam.",
        type: "Adventure",
        location: "Shah Alam",
        destinationId: "kl",
        tags: ["nature", "adventure", "family_friendly"],
        latitude: 3.0908,
        longitude: 101.5165,
        suggested_duration: 180,
        price_level: 3,
        opening_hours: "09:00 - 15:30",
        rating: 4.7,
        price: 70,
        image_url: "https://images.unsplash.com/photo-1542823617-6cb566580998?auto=format&fit=crop&w=800"
    },
    {
        name: "I-City",
        description: "Theme park and digital light city.",
        type: "Entertainment",
        location: "Shah Alam",
        destinationId: "kl",
        tags: ["theme_park", "family_friendly", "viral_spot"],
        latitude: 3.0645,
        longitude: 101.4851,
        suggested_duration: 180,
        price_level: 3,
        opening_hours: "11:00 - 00:00",
        rating: 4.5,
        price: 80,
        image_url: "https://images.unsplash.com/photo-1513413157580-73895e631d87?auto=format&fit=crop&w=800"
    },
    {
        name: "Farm In The City",
        description: "Unique pet-friendly petting zoo.",
        type: "Nature",
        location: "Seri Kembangan",
        destinationId: "kl",
        tags: ["nature", "family_friendly", "educational"],
        latitude: 2.9814,
        longitude: 101.6738,
        suggested_duration: 180,
        price_level: 3,
        opening_hours: "10:00 - 18:00",
        rating: 4.7,
        price: 58,
        image_url: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800"
    }
];

async function seedSmartData() {
    try {
        console.log('🧹 Clearing attractions collection...');
        const snapshot = await db.collection('attractions').get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log('✨ Cleared.');

        console.log('🌱 Seeding Smart Malaysia Attractions...');
        for (const a of ATTRACTIONS) {
            await db.collection('attractions').add(a);
            console.log(`- Seeded: ${a.name}`);
        }

        console.log('✅ Smart Data Seeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedSmartData();
