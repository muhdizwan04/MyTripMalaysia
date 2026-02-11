import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Destinations
export const getDestinations = () => api.get('/destinations')
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - getDestinations:', error.response?.data || error.message);
        throw error;
    });

export const createDestination = (data) => api.post('/destinations', data)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - createDestination:', error.response?.data || error.message);
        throw error;
    });

export const deleteDestination = (id) => api.delete(`/destinations/${id}`)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - deleteDestination:', error.response?.data || error.message);
        throw error;
    });

// Attractions
export const getAttractions = (filters = {}) => api.get('/attractions', { params: filters })
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - getAttractions:', error.response?.data || error.message);
        throw error;
    });

export const createAttraction = (data) => api.post('/attractions', data)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - createAttraction:', error.response?.data || error.message);
        throw error;
    });

export const updateAttraction = (id, data) => api.put(`/attractions/${id}`, data)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - updateAttraction:', error.response?.data || error.message);
        throw error;
    });

export const deleteAttraction = (id) => api.delete(`/attractions/${id}`)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - deleteAttraction:', error.response?.data || error.message);
        throw error;
    });

// Shops
export const getShops = (mallId) => api.get('/shops', { params: { mallId } })
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - getShops:', error.response?.data || error.message);
        throw error;
    });

export const createShop = (data) => api.post('/shops', data)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - createShop:', error.response?.data || error.message);
        throw error;
    });

export const deleteShop = (id) => api.delete(`/shops/${id}`)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - deleteShop:', error.response?.data || error.message);
        throw error;
    });

export const updateShop = (id, data) => api.put(`/shops/${id}`, data)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - updateShop:', error.response?.data || error.message);
        throw error;
    });

// Upload
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => res.data);
};
// Transport
export const getTransportLines = () => api.get('/transport/lines')
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - getTransportLines:', error.response?.data || error.message);
        throw error;
    });

export const calculateTransport = (data) => api.post('/transport/calculate', data)
    .then(res => res.data)
    .catch(error => {
        console.error('API Error - calculateTransport:', error.response?.data || error.message);
        throw error;
    });
