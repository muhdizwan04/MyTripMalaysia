const attractionService = require('../services/attractionService');

const getAll = async (req, res) => {
    try {
        console.log('GET /attractions called with query:', req.query);
        const { destinationId, isMall, is_must_visit, type } = req.query;
        const attractions = await attractionService.getAllAttractions({ destinationId, isMall, is_must_visit, type });
        console.log(`Returning ${attractions.length} attractions`);
        res.json(attractions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const attraction = await attractionService.getAttractionById(req.params.id);
        if (!attraction) return res.status(404).json({ error: 'Attraction not found' });
        res.json(attraction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const {
            name, destinationId, type, latitude, longitude, avgDuration, avgCost,
            isMall, is_mall, isTrending, is_trending, isMustVisit, is_must_visit,
            description, image_url, location, rating, ticket_price, review_count,
            price
        } = req.body;

        // Required fields validation - relaxed for admin
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Create attraction with all fields
        const newAttraction = await attractionService.createAttraction({
            name,
            destinationId: destinationId || '',
            type: type || 'Attraction',
            latitude: latitude ? parseFloat(latitude) : 0,
            longitude: longitude ? parseFloat(longitude) : 0,
            avgDuration: avgDuration ? parseInt(avgDuration) : 120,

            // Standardized fields
            price: price !== undefined ? parseFloat(price) : (avgCost ? parseFloat(avgCost) : 0),
            isMall: isMall !== undefined ? !!isMall : !!is_mall,
            isTrending: isTrending !== undefined ? !!isTrending : !!is_trending,
            isMustVisit: isMustVisit !== undefined ? !!isMustVisit : !!is_must_visit,

            description: description || '',
            image_url: image_url || '',
            location: location || '',
            rating: rating ? parseFloat(rating) : 0,
            review_count: review_count ? parseInt(review_count) : 0
        });
        res.status(201).json(newAttraction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const updated = await attractionService.updateAttraction(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await attractionService.deleteAttraction(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMalls = async (req, res) => {
    try {
        console.log('GET /attractions/malls called');
        // Fetch only attractions where isMall or is_mall is true
        const malls = await attractionService.getAllAttractions({ isMall: true });
        console.log(`Found ${malls.length} malls`);
        res.json(malls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    getMalls,
    create,
    update,
    remove
};
