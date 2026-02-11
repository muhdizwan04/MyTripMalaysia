const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attractionController');

router.get('/', attractionController.getAll);
router.get('/malls', attractionController.getMalls);
router.get('/:id', attractionController.getById);
router.post('/', attractionController.create);
router.put('/:id', attractionController.update);
router.delete('/:id', attractionController.remove);

module.exports = router;
