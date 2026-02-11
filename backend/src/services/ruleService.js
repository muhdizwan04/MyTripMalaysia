const { db } = require('../config/firebase');

const RULE_DOC_ID = 'default_rules';

const getRules = async () => {
    const doc = await db.collection('itinerary_rules').doc(RULE_DOC_ID).get();
    if (!doc.exists) {
        // Return default rules if not found
        return {
            maxActivitiesPerDay: 4,
            travelPace: 'balanced',
            budgetRange: { low: 200, mid: 500, high: 1000 }
        };
    }
    return doc.data();
};

const updateRules = async (data) => {
    await db.collection('itinerary_rules').doc(RULE_DOC_ID).set(data, { merge: true });
    return data;
};

module.exports = {
    getRules,
    updateRules
};
