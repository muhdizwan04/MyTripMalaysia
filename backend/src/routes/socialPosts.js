const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

const socialPostsCollection = db.collection('social_posts');

// GET all social posts (with optional pagination)
router.get('/', async (req, res) => {
    try {
        const { limit = 50, userId } = req.query;

        let query = socialPostsCollection.orderBy('created_at', 'desc');

        // Filter by user if userId provided
        if (userId) {
            query = query.where('author_id', '==', userId);
        }

        query = query.limit(parseInt(limit));

        const snapshot = await query.get();
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET post by ID
router.get('/:id', async (req, res) => {
    try {
        const doc = await socialPostsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create social post
router.post('/', async (req, res) => {
    try {
        const { author_id, author_name, author_image, location_name, image_url, caption, tags, rating } = req.body;

        const newPost = {
            author_id,
            author_name,
            author_image: author_image || '',
            location_name,
            image_url,
            caption: caption || '',
            tags: tags || [],
            likes_count: 0,
            comments_count: 0,
            rating: rating || 0,
            created_at: new Date(),
            updated_at: new Date()
        };

        const docRef = await socialPostsCollection.add(newPost);
        res.status(201).json({ id: docRef.id, ...newPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update social post
router.put('/:id', async (req, res) => {
    try {
        const { caption, tags, likes_count, comments_count, rating } = req.body;

        const updateData = {
            updated_at: new Date()
        };

        if (caption !== undefined) updateData.caption = caption;
        if (tags) updateData.tags = tags;
        if (likes_count !== undefined) updateData.likes_count = likes_count;
        if (comments_count !== undefined) updateData.comments_count = comments_count;
        if (rating !== undefined) updateData.rating = rating;

        await socialPostsCollection.doc(req.params.id).update(updateData);
        const doc = await socialPostsCollection.doc(req.params.id).get();
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE social post
router.delete('/:id', async (req, res) => {
    try {
        await socialPostsCollection.doc(req.params.id).delete();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
