const shopService = require('../services/shopService');
const attractionService = require('../services/attractionService');

const getAll = async (req, res) => {
    try {
        const { mall_id } = req.query;
        const shops = await shopService.getAllShops(mall_id);
        res.json(shops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const shop = await shopService.getShopById(req.params.id);
        if (!shop) return res.status(404).json({ error: 'Shop not found' });
        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { name, mall_id, category, floor, image_url } = req.body;

        if (!name || !mall_id || !category) {
            return res.status(400).json({ error: 'Name, mall_id, and category are required' });
        }

        // Verify if mall exists
        const mall = await attractionService.getAttractionById(mall_id);
        if (!mall) {
            return res.status(404).json({ error: 'Mall not found' });
        }

        // Ensure it's a mall (legacy check for is_mall or type)
        const isMall = mall.type === 'Mall' || mall.is_mall === true || mall.isMall === true;
        if (!isMall) {
            return res.status(400).json({ error: 'The provided mall_id does not belong to a Mall attraction' });
        }

        const newShop = await shopService.createShop({
            name,
            mall_id,
            category,
            floor: floor || 'General',
            image_url: image_url || ''
        });
        res.status(201).json(newShop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const updated = await shopService.updateShop(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await shopService.deleteShop(req.params.id);
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
