const { db } = require('../config/firebase');

const getAllAttractions = async (filters = {}) => {
    let query = db.collection('attractions');

    if (filters.destinationId) {
        query = query.where('destinationId', '==', filters.destinationId);
    }

    if (filters.isMall === 'true' || filters.isMall === true) {
        query = query.where('isMall', '==', true);
    }

    if (filters.type) {
        query = query.where('type', '==', filters.type);
    }

    if (filters.is_must_visit === 'true' || filters.is_must_visit === true) {
        query = query.where('is_must_visit', '==', true);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getAttractionById = async (id) => {
    const doc = await db.collection('attractions').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const createAttraction = async (data) => {
    if (!data.destinationId) throw new Error('destinationId is required');
    const docRef = await db.collection('attractions').add(data);
    return { id: docRef.id, ...data };
};

const updateAttraction = async (id, data) => {
    await db.collection('attractions').doc(id).update(data);
    return { id, ...data };
};

const deleteAttraction = async (id) => {
    await db.collection('attractions').doc(id).delete();
    return { id };
};

module.exports = {
    getAllAttractions,
    getAttractionById,
    createAttraction,
    updateAttraction,
    deleteAttraction
};
