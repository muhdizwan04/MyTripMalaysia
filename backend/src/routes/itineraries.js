const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Use the new collection name 'itineraries'
const itinerariesCollection = db.collection('itineraries');

// GET all itineraries (for trending section)
router.get('/', async (req, res) => {
    try {
        console.log('GET /itineraries called with query:', req.query);
        const { limit = 10 } = req.query;
        let query = itinerariesCollection;

        // Remove orderBy for now as it might require a Firestore index we don't have yet
        // query = query.orderBy('created_at', 'desc');

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const snapshot = await query.get();
        const itineraries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Returning ${itineraries.length} itineraries`);
        res.json(itineraries);
    } catch (error) {
        console.error('Error in GET /itineraries:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET itinerary by ID
router.get('/:id', async (req, res) => {
    try {
        const doc = await itinerariesCollection.doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create itinerary
router.post('/', async (req, res) => {
    try {
        // Golden Schema: title, days, price, type, image_url
        const { title, days, price, type, image_url, description, highlights } = req.body;

        const newItinerary = {
            title,
            days: parseInt(days),
            price: parseFloat(price),
            type,
            image_url: image_url || '',
            description: description || '',
            highlights: highlights || [],
            created_at: new Date(),
            updated_at: new Date()
        };

        const docRef = await itinerariesCollection.add(newItinerary);
        res.status(201).json({ id: docRef.id, ...newItinerary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update itinerary
router.put('/:id', async (req, res) => {
    try {
        const { title, days, price, type, image_url, description, highlights } = req.body;

        const updateData = {
            updated_at: new Date()
        };

        if (title) updateData.title = title;
        if (days) updateData.days = parseInt(days);
        if (price) updateData.price = parseFloat(price);
        if (type) updateData.type = type;
        if (image_url !== undefined) updateData.image_url = image_url;
        if (description !== undefined) updateData.description = description;
        if (highlights) updateData.highlights = highlights;

        await itinerariesCollection.doc(req.params.id).update(updateData);
        const doc = await itinerariesCollection.doc(req.params.id).get();
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE itinerary
router.delete('/:id', async (req, res) => {
    try {
        await itinerariesCollection.doc(req.params.id).delete();
        res.json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
