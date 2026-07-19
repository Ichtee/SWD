const FoodOrder = require('../models/FoodOrder');
const FoodOrderDetail = require('../models/FoodOrderDetail');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');

class FoodOrderRepository {
    async create(orderData, transaction) {
        return await FoodOrder.create(orderData, { transaction });
    }

    async findById(id) {
        return await FoodOrder.findByPk(id, {
            include: [
                { model: FoodOrderDetail, as: 'details', include: [{ model: FoodItem, as: 'item' }] },
                { model: User, attributes: ['full_name', 'email'] }
            ]
        });
    }

    async update(id, updateData, transaction) {
        const order = await FoodOrder.findByPk(id);
        if (!order) return null;
        return await order.update(updateData, { transaction });
    }

    async findAll(whereClause = {}) {
        return await FoodOrder.findAll({
            where: whereClause,
            include: [
                { model: FoodOrderDetail, as: 'details', include: [{ model: FoodItem, as: 'item' }] },
                { model: User, attributes: ['full_name', 'email'] }
            ],
            order: [['created_at', 'DESC']]
        });
    }
}

module.exports = new FoodOrderRepository();
