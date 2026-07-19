const FoodService = require('../services/FoodService');

class FoodController {
    async getFoodItems(req, res, next) {
        try {
            const items = await FoodService.getFoodItems(req.query, req.user);
            res.json(items);
        } catch (error) {
            next(error);
        }
    }

    async createFoodOrder(req, res, next) {
        try {
            const order = await FoodService.createFoodOrder({
                items: req.body.items,
                user_id: req.user.user_id
            });
            res.status(201).json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async createCounterSale(req, res, next) {
        try {
            const result = await FoodService.createCounterSale({
                items: req.body.items,
                customer_email: req.body.customer_email,
                staff_user_id: req.user.user_id
            });
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async createFoodItem(req, res, next) {
        try {
            const item = await FoodService.createFoodItem(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateFoodItem(req, res, next) {
        try {
            const item = await FoodService.updateFoodItem(req.params.id, req.body);
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteFoodItem(req, res, next) {
        try {
            const result = await FoodService.deleteFoodItem(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new FoodController();
