const destinationService = require('../services/destinationService');

const getAll = async (req, res) => {
    try {
        const destinations = await destinationService.getAllDestinations();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const destination = await destinationService.getDestinationById(req.params.id);
        if (!destination) return res.status(404).json({ error: 'Destination not found' });
        res.json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const newDestination = await destinationService.createDestination(req.body);
        res.status(201).json(newDestination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const updated = await destinationService.updateDestination(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await destinationService.deleteDestination(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
