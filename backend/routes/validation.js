const express = require('express');
const router = express.Router();
const ValidationRules = require('../models/validationRules');

// GET /api/validation/rules - Get current validation rules
router.get('/rules', (req, res) => {
    try {
        res.json(ValidationRules);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch validation rules' });
    }
});

// PUT /api/validation/rules - Update validation rules (admin only)
router.put('/rules', (req, res) => {
    try {
        const { maxActivitiesPerDay, maxDurationHours, defaultDailyBudget } = req.body;

        if (maxActivitiesPerDay) ValidationRules.maxActivitiesPerDay = maxActivitiesPerDay;
        if (maxDurationHours) ValidationRules.maxDurationHours = maxDurationHours;
        if (defaultDailyBudget) ValidationRules.defaultDailyBudget = defaultDailyBudget;

        res.json(ValidationRules);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update validation rules' });
    }
});

module.exports = router;
