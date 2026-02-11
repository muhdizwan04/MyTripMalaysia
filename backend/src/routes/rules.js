const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

router.get('/', ruleController.get);
router.post('/', ruleController.update);

module.exports = router;
