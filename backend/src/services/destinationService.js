const { db } = require('../config/firebase');

const getAllDestinations = async () => {
    const snapshot = await db.collection('destinations').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getDestinationById = async (id) => {
    const doc = await db.collection('destinations').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const createDestination = async (data) => {
    const docRef = await db.collection('destinations').add(data);
    return { id: docRef.id, ...data };
};

const updateDestination = async (id, data) => {
    await db.collection('destinations').doc(id).update(data);
    return { id, ...data };
};

const deleteDestination = async (id) => {
    await db.collection('destinations').doc(id).delete();
    return { id };
};

module.exports = {
    getAllDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
};
