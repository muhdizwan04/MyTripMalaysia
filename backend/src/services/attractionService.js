const { db } = require('../config/firebase');

const getAllAttractions = async (filters = {}) => {
    let query = db.collection('attractions');

    if (filters.destinationId) {
        query = query.where('destinationId', '==', filters.destinationId);
    }

    if (filters.is_mall === 'true' || filters.is_mall === true || filters.isMall === 'true' || filters.isMall === true) {
        query = query.where('isMall', '==', true);
    }

    if (filters.is_trending === 'true' || filters.is_trending === true || filters.isTrending === 'true' || filters.isTrending === true) {
        query = query.where('isTrending', '==', true);
    }

    if (filters.type) {
        query = query.where('type', '==', filters.type);
    }

    if (filters.is_must_visit === 'true' || filters.is_must_visit === true || filters.isMustVisit === 'true' || filters.isMustVisit === true) {
        query = query.where('isMustVisit', '==', true);
    }

    if (filters.state) {
        query = query.where('state', '==', filters.state);
    }

    if (filters.destinationId) {
        query = query.where('destinationId', '==', filters.destinationId);
    }

    // Optimization: Default limit to prevent full collection scans
    const limit = parseInt(filters.limit) || 20;
    query = query.limit(limit);

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
