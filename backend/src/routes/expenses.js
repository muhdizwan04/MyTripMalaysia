const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// POST /api/expenses - Save a new expense
router.post('/', expenseController.createExpense);

// GET /api/expenses/user/:username - Get standalone expenses for a user
router.get('/user/:username', expenseController.getExpensesByUser);

// GET /api/expenses/:tripId - Get all expenses for a specific trip
router.get('/:tripId', expenseController.getExpensesByTrip);

module.exports = router;
