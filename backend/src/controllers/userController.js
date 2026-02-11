const { db } = require('../config/firebase');

const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        // Try to find user by username
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).limit(1).get();

        if (snapshot.empty) {
            // If not found by username, try by document ID
            const doc = await usersRef.doc(username).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json({ id: doc.id, ...doc.data() });
        }

        const userDoc = snapshot.docs[0];
        res.json({ id: userDoc.id, ...userDoc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserProfile,
    getAllUsers
};
