const { db } = require('../config/firebase');

exports.getDashboardStats = async (req, res) => {
    try {
        console.log('Fetching dashboard stats...');

        // 1. Get Counts
        const [usersSnap, destSnap, attrSnap, hotelsSnap] = await Promise.all([
            db.collection('users').count().get(),
            db.collection('destinations').count().get(),
            db.collection('attractions').count().get(),
            db.collection('hotels').count().get()
        ]);

        const totalUsers = usersSnap.data().count;
        const totalDestinations = destSnap.data().count;
        const totalAttractions = attrSnap.data().count;
        const totalHotels = hotelsSnap.data().count;

        // 2. Aggregations (Attractions per State)
        // Note: For large datasets, maintain a counter document. For now, we fetch all.
        const allAttractionsSnap = await db.collection('attractions').select('state').get();
        const stateCounts = {};

        allAttractionsSnap.forEach(doc => {
            const state = doc.data().state || 'Unknown';
            stateCounts[state] = (stateCounts[state] || 0) + 1;
        });

        // Format for Recharts (Array of objects)
        const attractionsPerState = Object.entries(stateCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort by count desc

        // 3. Recent Activity (Latest 5 Attractions)
        // Assuming 'createdAt' or just default ordering if timestamp is missing. 
        // If no timestamp, we might just take the last added (natural order is not guaranteed without sort).
        // We will try sorting by a 'createdAt' field, if it exists, otherwise just take a chunk.
        // For this task, let's assume we can sort by 'createdAt' desc.
        // If 'createdAt' doesn't exist on all docs, this might be tricky. 
        // Let's try to grab the latest added if possible, or just 5 random ones if no timestamp.

        let recentActivitySnap;
        try {
            recentActivitySnap = await db.collection('attractions')
                .orderBy('createdAt', 'desc')
                .limit(5)
                .get();
        } catch (err) {
            // Fallback if index missing or field missing
            console.log('Sort by createdAt failed, fetching standard limit');
            recentActivitySnap = await db.collection('attractions').limit(5).get();
        }

        const recentActivity = recentActivitySnap.docs.map(doc => ({
            id: doc.id,
            type: 'Attraction',
            name: doc.data().name,
            state: doc.data().state,
            createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
        }));

        res.json({
            counts: {
                totalUsers,
                totalDestinations,
                totalAttractions,
                totalHotels
            },
            charts: {
                attractionsPerState
            },
            recentActivity
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
