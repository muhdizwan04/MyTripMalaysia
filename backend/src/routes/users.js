const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

const usersCollection = db.collection('users');

// GET all users
router.get('/', async (req, res) => {
    try {
        const snapshot = await usersCollection.get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const doc = await usersCollection.doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create user
router.post('/', async (req, res) => {
    try {
        const { username, full_name, bio, profile_image, email } = req.body;

        const newUser = {
            username,
            full_name,
            bio: bio || '',
            profile_image: profile_image || '',
            email,
            counts: {
                trips: 0,
                posts: 0,
                saved: 0
            },
            created_at: new Date(),
            updated_at: new Date()
        };

        const docRef = await usersCollection.add(newUser);
        res.status(201).json({ id: docRef.id, ...newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const { username, full_name, bio, profile_image, email, counts } = req.body;

        const updateData = {
            updated_at: new Date()
        };

        if (username) updateData.username = username;
        if (full_name) updateData.full_name = full_name;
        if (bio !== undefined) updateData.bio = bio;
        if (profile_image !== undefined) updateData.profile_image = profile_image;
        if (email) updateData.email = email;
        if (counts) updateData.counts = counts;

        await usersCollection.doc(req.params.id).update(updateData);
        const doc = await usersCollection.doc(req.params.id).get();
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        await usersCollection.doc(req.params.id).delete();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
