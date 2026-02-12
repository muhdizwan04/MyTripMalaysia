import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Android Emulator use 'http://10.0.2.2:5001/api'
// For iOS Simulator use 'http://localhost:5001/api'
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
export const fetchAttractions = (query) => {
    const params = typeof query === 'string' ? { state: query } : query;
    return api.get('/attractions', { params }).then(res => res.data);
};

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
export const fetchDestinations = () => api.get('/destinations').then(res => res.data.sort((a, b) => a.name.localeCompare(b.name)));

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
export const fetchUserTrips = async () => {
    const savedTripsJson = await AsyncStorage.getItem('my_trips');
    const savedTrips = savedTripsJson ? JSON.parse(savedTripsJson) : [];
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(savedTrips.reverse());
        }, 300);
    });
};

export const createLocalTrip = async (tripData) => {
    const savedTripsJson = await AsyncStorage.getItem('my_trips');
    const savedTrips = savedTripsJson ? JSON.parse(savedTripsJson) : [];
    const newTrip = { ...tripData, id: Date.now().toString() }; // Simple ID gen
    savedTrips.push(newTrip);
    await AsyncStorage.setItem('my_trips', JSON.stringify(savedTrips));

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(newTrip);
        }, 300);
    });
};

// Transport API
export const getTransportLines = () => api.get('/transport/lines').then(res => res.data);
export const calculateTransport = (data) => api.post('/transport/calculate', data).then(res => res.data);
