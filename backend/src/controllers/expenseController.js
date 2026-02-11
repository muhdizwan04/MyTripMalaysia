const { db } = require('../config/firebase');

const expensesCollection = db.collection('expenses');

// POST /api/expenses
exports.createExpense = async (req, res) => {
    try {
        const { trip_id, title, amount, category, payer, participants, split_method, date } = req.body;

        // Validation
        if (!title || !amount || !payer || !participants || participants.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newExpense = {
            trip_id: trip_id || null, // Optional
            title,
            amount: parseFloat(amount),
            category,
            payer,
            participants, // Array of strings or objects? User example: ["You", "Sarah"]
            split_method: split_method || 'EQUALLY',
            date: date ? new Date(date) : new Date(),
            created_at: new Date()
        };

        const docRef = await expensesCollection.add(newExpense);
        res.status(201).json({ id: docRef.id, ...newExpense });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/expenses/:tripId
exports.getExpensesByTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const snapshot = await expensesCollection.where('trip_id', '==', tripId).orderBy('date', 'desc').get();

        if (snapshot.empty) {
            return res.json([]);
        }

        const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/expenses/user/:username
// Strategy: Fetch expenses where user is payer OR user is in participants
exports.getExpensesByUser = async (req, res) => {
    try {
        const { username } = req.params;

        // Firestore doesn't support logical OR in a single query easily for this structure without multiple indices or client-side merge.
        // For simplicity and to cover the "Standalone" requirement, we'll fetch where user is involved.
        // Let's fetch where payer == username

        const payerSnapshot = await expensesCollection.where('payer', '==', username).orderBy('date', 'desc').get();
        const payerExpenses = payerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Also fetch where participants array contains username
        const participantSnapshot = await expensesCollection.where('participants', 'array-contains', username).orderBy('date', 'desc').get();
        const participantExpenses = participantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Merge and deduplicate
        const allExpensesMap = new Map();
        [...payerExpenses, ...participantExpenses].forEach(exp => {
            allExpensesMap.set(exp.id, exp);
        });

        const allExpenses = Array.from(allExpensesMap.values()).sort((a, b) => b.date - a.date);

        res.json(allExpenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
