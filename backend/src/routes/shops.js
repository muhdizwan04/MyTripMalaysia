const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/', shopController.getAll);
router.get('/:id', shopController.getById);
router.post('/', shopController.create);
router.put('/:id', shopController.update);
router.delete('/:id', shopController.remove);

module.exports = router;
