const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Get all hotels
router.get('/', async (req, res) => {
    try {
        console.log('GET /hotels called with query:', req.query);
        const { limit = 20 } = req.query;
        let query = db.collection('hotels');

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const hotelsSnapshot = await query.get();
        const hotels = hotelsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`Returning ${hotels.length} hotels`);
        res.json(hotels);
    } catch (error) {
        console.error('Error in GET /hotels:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create hotel
router.post('/', async (req, res) => {
    try {
        const hotel = req.body;
        const docRef = await db.collection('hotels').add(hotel);
        res.status(201).json({ id: docRef.id, ...hotel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update hotel
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = req.body;
        await db.collection('hotels').doc(id).update(hotel);
        res.json({ id, ...hotel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete hotel
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('hotels').doc(id).delete();
        res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
