const { db } = require('../config/firebase');

const getAllShops = async (mall_id) => {
    let query = db.collection('shops');
    if (mall_id) {
        query = query.where('mall_id', '==', mall_id);
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getShopById = async (id) => {
    const doc = await db.collection('shops').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const createShop = async (data) => {
    if (!data.mall_id) throw new Error('mall_id is required');
    const docRef = await db.collection('shops').add(data);
    return { id: docRef.id, ...data };
};

const updateShop = async (id, data) => {
    await db.collection('shops').doc(id).update(data);
    return { id, ...data };
};

const deleteShop = async (id) => {
    await db.collection('shops').doc(id).delete();
    return { id };
};

module.exports = {
    getAllShops,
    getShopById,
    createShop,
    updateShop,
    deleteShop
};
