import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Destinations
export const getDestinations = () => api.get('/destinations').then(res => res.data);

// Attractions
export const getAttractions = (filters = {}) => api.get('/attractions', { params: filters }).then(res => res.data);
export const fetchAttractionById = (id) => api.get(`/attractions/${id}`).then(res => res.data);

// NEW: Fetch all attractions
export const fetchAttractions = () => api.get('/attractions').then(res => res.data);

// NEW: Fetch only malls
export const fetchMalls = () => api.get('/attractions', { params: { type: 'Mall' } }).then(res => res.data);

// Shops
export const getShops = (mall_id) => api.get('/shops', { params: { mall_id } }).then(res => res.data);

// NEW: Fetch shops by mall ID
export const fetchShops = (mall_id) => api.get('/shops', { params: { mall_id } }).then(res => res.data);

// NEW: Users
export const fetchUserProfile = (username) => api.get(`/users/${username}`).then(res => res.data);

export const getAllUsers = () => api.get('/users').then(res => res.data);

// Validation Rules
export const getValidationRules = async () => {
    try {
        const response = await api.get('/validation/rules');
        return response.data;
    } catch (error) {
        console.error('Error fetching validation rules:', error);
        // Return default rules if API fails
        return {
            maxActivitiesPerDay: 5,
            maxDurationHours: 8,
            defaultDailyBudget: 300
        };
    }
};

// NEW: Fetch all destinations
export const fetchDestinations = () => api.get('/destinations').then(res => res.data);

// NEW: Fetch all hotels
export const fetchHotels = () => api.get('/hotels').then(res => res.data);

// NEW: Fetch community posts
export const fetchCommunityPosts = () => api.get('/social-posts').then(res => res.data);

// NEW: Expenses API
export const createExpense = (expenseData) => api.post('/expenses', expenseData).then(res => res.data);
export const fetchTripExpenses = (tripId) => api.get(`/expenses/${tripId}`).then(res => res.data);
export const fetchUserExpenses = (username) => api.get(`/expenses/user/${username}`).then(res => res.data);
export const fetchMustVisitAttractions = () => api.get('/attractions', { params: { is_must_visit: true } }).then(res => res.data);

// NEW: Fetch all itineraries
export const fetchItineraries = () => api.get('/itineraries').then(res => res.data);

// Mock Fetch Trips (frontend-only for now, mimicking API)
export const fetchUserTrips = () => {
    return new Promise((resolve) => {
        const savedTrips = JSON.parse(localStorage.getItem('my_trips') || '[]');
        // Simulate network delay
        setTimeout(() => {
            resolve(savedTrips.reverse());
        }, 300);
    });
};

export const createLocalTrip = (tripData) => {
    return new Promise((resolve) => {
        const savedTrips = JSON.parse(localStorage.getItem('my_trips') || '[]');
        const newTrip = { ...tripData, id: Date.now().toString() }; // Simple ID gen
        savedTrips.push(newTrip);
        localStorage.setItem('my_trips', JSON.stringify(savedTrips));
        setTimeout(() => {
            resolve(newTrip);
        }, 300);
    });
};

// Transport API
export const getTransportLines = () => api.get('/transport/lines').then(res => res.data);
export const calculateTransport = (data) => api.post('/transport/calculate', data).then(res => res.data);
