const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const TRANSPORT_LINES = [
    {
        line_name: "LRT Kelana Jaya Line",
        type: "LRT",
        color_code: "#E0004D",
        operating_hours: { start: "06:00", end: "23:30" },
        frequency: { peak: "3 mins", off_peak: "10 mins" },
        stations: [
            { name: "Gombak", code: "KJ1", lat: 3.2311, lng: 101.7244, interchange: false },
            { name: "Wangsa Maju", code: "KJ3", lat: 3.2058, lng: 101.7322, interchange: false },
            { name: "Setiawangsa", code: "KJ5", lat: 3.1757, lng: 101.7347, interchange: false },
            { name: "Ampang Park", code: "KJ9", lat: 3.1598, lng: 101.7191, interchange: true },
            { name: "KLCC", code: "KJ10", lat: 3.1591, lng: 101.7138, interchange: false },
            { name: "Kampung Baru", code: "KJ11", lat: 3.1596, lng: 101.7034, interchange: false },
            { name: "Dang Wangi", code: "KJ12", lat: 3.1568, lng: 101.6994, interchange: true },
            { name: "Masjid Jamek", code: "KJ13", lat: 3.1495, lng: 101.6965, interchange: true },
            { name: "Pasar Seni", code: "KJ14", lat: 3.1425, lng: 101.6953, interchange: true },
            { name: "KL Sentral", code: "KJ15", lat: 3.1344, lng: 101.6865, interchange: true },
            { name: "Bangsar", code: "KJ16", lat: 3.1273, lng: 101.6787, interchange: false },
            { name: "Abdullah Hukum", code: "KJ17", lat: 3.1188, lng: 101.6738, interchange: true },
            { name: "Universiti", code: "KJ19", lat: 3.1144, lng: 101.6617, interchange: false }
        ]
    },
    {
        line_name: "MRT Kajang Line",
        type: "MRT",
        color_code: "#008130",
        operating_hours: { start: "06:00", end: "23:30" },
        frequency: { peak: "4 mins", off_peak: "12 mins" },
        stations: [
            { name: "Kwasa Damansara", code: "KG04", lat: 3.1764, lng: 101.5724, interchange: true },
            { name: "Surian", code: "KG07", lat: 3.1494, lng: 101.5938, interchange: false },
            { name: "1 Utama", code: "KG09", lat: 3.1471, lng: 101.6186, interchange: false },
            { name: "TTDI", code: "KG10", lat: 3.1367, lng: 101.6225, interchange: false },
            { name: "Phileo Damansara", code: "KG12", lat: 3.1293, lng: 101.6425, interchange: false },
            { name: "Pusat Bandar Damansara", code: "KG13", lat: 3.1432, lng: 101.6624, interchange: false },
            { name: "Semantan", code: "KG14", lat: 3.1511, lng: 101.6653, interchange: false },
            { name: "Muzium Negara", code: "KG15", lat: 3.1369, lng: 101.6890, interchange: true },
            { name: "Pasar Seni", code: "KG16", lat: 3.1421, lng: 101.6963, interchange: true },
            { name: "Merdeka", code: "KG17", lat: 3.1415, lng: 101.7019, interchange: true },
            { name: "Bukit Bintang", code: "KG18A", lat: 3.1472, lng: 101.7115, interchange: true },
            { name: "TRX", code: "KG20", lat: 3.1422, lng: 101.7185, interchange: true },
            { name: "Cochrane", code: "KG21", lat: 3.1328, lng: 101.7231, interchange: false },
            { name: "Maluri", code: "KG22", lat: 3.1275, lng: 101.7275, interchange: true }
        ]
    },
    {
        line_name: "KL Monorail",
        type: "Monorail",
        color_code: "#97C416",
        operating_hours: { start: "06:00", end: "23:30" },
        frequency: { peak: "6 mins", off_peak: "12 mins" },
        stations: [
            { name: "KL Sentral", code: "MR1", lat: 3.1325, lng: 101.6872, interchange: true },
            { name: "Tun Sambanthan", code: "MR2", lat: 3.1303, lng: 101.6912, interchange: false },
            { name: "Maharajalela", code: "MR3", lat: 3.1387, lng: 101.6974, interchange: false },
            { name: "Hang Tuah", code: "MR4", lat: 3.1407, lng: 101.7061, interchange: true },
            { name: "Imbi", code: "MR5", lat: 3.1428, lng: 101.7104, interchange: false },
            { name: "Bukit Bintang", code: "MR6", lat: 3.1458, lng: 101.7115, interchange: true },
            { name: "Raja Chulan", code: "MR7", lat: 3.1512, lng: 101.7108, interchange: false },
            { name: "Bukit Nanas", code: "MR8", lat: 3.1569, lng: 101.7047, interchange: true },
            { name: "Medan Tuanku", code: "MR9", lat: 3.1593, lng: 101.6987, interchange: false },
            { name: "Chow Kit", code: "MR10", lat: 3.1636, lng: 101.6983, interchange: false },
            { name: "Titiwangsa", code: "MR11", lat: 3.1702, lng: 101.6953, interchange: true }
        ]
    },
    {
        line_name: "KTM Seremban Line",
        type: "KTM",
        color_code: "#005BAA",
        operating_hours: { start: "05:30", end: "22:30" },
        frequency: { peak: "30 mins", off_peak: "60 mins" },
        stations: [
            { name: "Batu Caves", code: "KC05", lat: 3.2372, lng: 101.6814, interchange: false },
            { name: "Taman Wahyu", code: "KC04", lat: 3.2145, lng: 101.6724, interchange: false },
            { name: "Kampung Batu", code: "KC03", lat: 3.2031, lng: 101.6738, interchange: true },
            { name: "Batu Kentonmen", code: "KC02", lat: 3.1931, lng: 101.6798, interchange: false },
            { name: "Sentul", code: "KC01", lat: 3.1818, lng: 101.6946, interchange: false },
            { name: "Putra", code: "KA04", lat: 3.1652, lng: 101.6908, interchange: true },
            { name: "Bank Negara", code: "KA03", lat: 3.1546, lng: 101.6931, interchange: true },
            { name: "Kuala Lumpur", code: "KA02", lat: 3.1396, lng: 101.6938, interchange: true },
            { name: "KL Sentral", code: "KA01", lat: 3.1344, lng: 101.6865, interchange: true },
            { name: "Mid Valley", code: "KB01", lat: 3.1188, lng: 101.6791, interchange: false },
            { name: "Seputeh", code: "KB02", lat: 3.1136, lng: 101.6811, interchange: false },
            { name: "Salak Selatan", code: "KB03", lat: 3.1009, lng: 101.7061, interchange: false },
            { name: "Serdang", code: "KB05", lat: 3.0236, lng: 101.7164, interchange: false },
            { name: "Kajang", code: "KB06", lat: 2.9828, lng: 101.7903, interchange: true }
        ]
    },
    {
        line_name: "KTM Port Klang Line",
        type: "KTM",
        color_code: "#F15A22",
        operating_hours: { start: "05:30", end: "22:30" },
        frequency: { peak: "30 mins", off_peak: "60 mins" },
        stations: [
            { name: "Tanjung Malim", code: "KA15", lat: 3.6841, lng: 101.5204, interchange: false },
            { name: "Rawang", code: "KA10", lat: 3.3191, lng: 101.5753, interchange: false },
            { name: "Sungai Buloh", code: "KA08", lat: 3.2064, lng: 101.5804, interchange: true },
            { name: "Kepong Sentral", code: "KA07", lat: 3.2096, lng: 101.6291, interchange: true },
            { name: "Kepong", code: "KA06", lat: 3.2144, lng: 101.6421, interchange: false },
            { name: "Segambut", code: "KA05", lat: 3.1866, lng: 101.6669, interchange: false },
            { name: "KL Sentral", code: "KA01", lat: 3.1344, lng: 101.6865, interchange: true },
            { name: "Angkasapuri", code: "KD01", lat: 3.1133, lng: 101.6736, interchange: false },
            { name: "Pantai Dalam", code: "KD02", lat: 3.0988, lng: 101.6669, interchange: false },
            { name: "Subang Jaya", code: "KD09", lat: 3.0801, lng: 101.5857, interchange: true },
            { name: "Batu Tiga", code: "KD10", lat: 3.0601, lng: 101.5564, interchange: false },
            { name: "Shah Alam", code: "KD11", lat: 3.0564, lng: 101.5238, interchange: false },
            { name: "Klang", code: "KD14", lat: 3.0433, lng: 101.4496, interchange: false }
        ]
    }
];

async function seedTransport() {
    try {
        console.log('🧹 Clearing transport_lines collection...');
        const snapshot = await db.collection('transport_lines').get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log('✨ Cleared.');

        console.log('🌱 Seeding Transport Data with KTM...');
        for (const line of TRANSPORT_LINES) {
            await db.collection('transport_lines').add(line);
            console.log(`- Seeded: ${line.line_name}`);
        }

        console.log('✅ Transport Data Seeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding transport data:', error);
        process.exit(1);
    }
}

seedTransport();
