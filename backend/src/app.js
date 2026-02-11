const express = require('express');
const cors = require('cors');
const { db } = require('./config/firebase');

const app = express();

// Middleware - CORS configured for multiple origins
app.use(cors({
    origin: [
        'http://localhost:5173',  // Main frontend
        'http://localhost:5174',  // Admin portal
        'http://localhost:5175',  // Additional dev server
        'http://localhost:5176',  // Main frontend (alt port)
        'http://localhost:5177'   // Admin portal (current)
    ],
    credentials: true
}));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Trip Planner Backend is running!');
});

const destinationRoutes = require('./routes/destinations');
const attractionRoutes = require('./routes/attractions');
const shopRoutes = require('./routes/shops');
const ruleRoutes = require('./routes/rules');
const validationRoutes = require('../routes/validation');
const userRoutes = require('./routes/users');
const socialPostRoutes = require('./routes/socialPosts');

const itinerariesRoutes = require('./routes/itineraries');
const hotelRoutes = require('./routes/hotels');
const expenseRoutes = require('./routes/expenses');
const uploadRoutes = require('./routes/upload');
const transportRoutes = require('./routes/transportRoutes');
const adminRoutes = require('./routes/admin');

app.use('/api/destinations', destinationRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social-posts', socialPostRoutes);
app.use('/api/itineraries', itinerariesRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
