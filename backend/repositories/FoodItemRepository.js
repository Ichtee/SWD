const FoodItem = require('../models/FoodItem');

class FoodItemRepository {
    async findAll(whereClause = {}) {
        return await FoodItem.findAll({ where: whereClause });
    }

    async findById(id) {
        return await FoodItem.findByPk(id);
    }

    async create(foodData) {
        return await FoodItem.create(foodData);
    }

    async update(id, foodData) {
        const item = await FoodItem.findByPk(id);
        if (!item) return null;
        return await item.update(foodData);
    }
}

module.exports = new FoodItemRepository();
