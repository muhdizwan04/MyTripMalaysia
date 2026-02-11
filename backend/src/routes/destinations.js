const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

router.get('/', destinationController.getAll);
router.get('/:id', destinationController.getById);
router.post('/', destinationController.create);
router.put('/:id', destinationController.update);
router.delete('/:id', destinationController.remove);

module.exports = router;
