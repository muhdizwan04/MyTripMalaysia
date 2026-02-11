const ruleService = require('../services/ruleService');

const get = async (req, res) => {
    try {
        const rules = await ruleService.getRules();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const updated = await ruleService.updateRules(req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    get,
    update
};
