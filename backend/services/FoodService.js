const FoodItemRepository = require('../repositories/FoodItemRepository');
const FoodOrderRepository = require('../repositories/FoodOrderRepository');
const FoodOrderDetailRepository = require('../repositories/FoodOrderDetailRepository');
const UserRepository = require('../repositories/UserRepository');

class FoodService {
    async getFoodItems({ status, type }, user) {
        const whereClause = {};

        if (status) {
            whereClause.status = status;
        } else {
            if (!user || user.role === 'CUSTOMER') {
                whereClause.status = 'AVAILABLE';
            }
        }

        if (type) {
            whereClause.type = type;
        }

        return await FoodItemRepository.findAll(whereClause);
    }

    async createFoodOrder({ items, user_id }) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error('No concessions items selected.');
        }

        let total_amount = 0;
        const detailsData = [];

        for (const item of items) {
            const food = await FoodItemRepository.findById(item.food_id);
            if (!food || food.status !== 'AVAILABLE') {
                throw new Error('Item is currently unavailable.');
            }

            const qty = parseInt(item.quantity);
            if (qty <= 0) continue;

            const price = parseFloat(food.price);
            total_amount += price * qty;
            detailsData.push({
                food_id: food.food_id,
                quantity: qty,
                unit_price: price
            });
        }

        const foodOrder = await FoodOrderRepository.create({
            user_id,
            booking_id: null,
            total_amount,
            status: 'PENDING'
        });

        for (const detail of detailsData) {
            await FoodOrderDetailRepository.create({
                order_id: foodOrder.order_id,
                food_id: detail.food_id,
                quantity: detail.quantity,
                unit_price: detail.unit_price
            });
        }

        return await FoodOrderRepository.findById(foodOrder.order_id);
    }

    async createCounterSale({ items, customer_email, staff_user_id }) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error('Please select items to checkout.');
        }

        let buyer_id = staff_user_id;
        if (customer_email) {
            const customer = await UserRepository.findByEmail(customer_email);
            if (customer) {
                buyer_id = customer.user_id;
            }
        }

        let total_amount = 0;
        const detailsData = [];

        for (const item of items) {
            const food = await FoodItemRepository.findById(item.food_id);
            if (!food || food.status !== 'AVAILABLE') {
                throw new Error(`Selected item ${food?.name || ''} is currently unavailable.`);
            }

            const qty = parseInt(item.quantity);
            if (qty <= 0) continue;

            const price = parseFloat(food.price);
            total_amount += price * qty;
            detailsData.push({
                food_id: food.food_id,
                quantity: qty,
                unit_price: price
            });
        }

        const foodOrder = await FoodOrderRepository.create({
            user_id: buyer_id,
            booking_id: null,
            total_amount,
            status: 'PAID'
        });

        for (const detail of detailsData) {
            await FoodOrderDetailRepository.create({
                order_id: foodOrder.order_id,
                food_id: detail.food_id,
                quantity: detail.quantity,
                unit_price: detail.unit_price
            });
        }

        const completeOrder = await FoodOrderRepository.findById(foodOrder.order_id);

        return {
            message: 'Counter transaction completed successfully.',
            order: completeOrder
        };
    }

    async createFoodItem(foodData) {
        if (!foodData.name || !foodData.type || !foodData.price) {
            throw new Error('Missing name, type, or price');
        }
        return await FoodItemRepository.create({
            ...foodData,
            status: foodData.status || 'AVAILABLE',
            description: foodData.description || ''
        });
    }

    async updateFoodItem(id, foodData) {
        const item = await FoodItemRepository.update(id, foodData);
        if (!item) throw new Error('Food item not found');
        return item;
    }

    async deleteFoodItem(id) {
        const item = await FoodItemRepository.findById(id);
        if (!item) throw new Error('Food item not found');

        // Check if item has historical orders
        // Use Sequelize count by direct query or model check
        const FoodOrderDetailModel = require('../models/FoodOrderDetail');
        const ordersCount = await FoodOrderDetailModel.count({ where: { food_id: item.food_id } });
        if (ordersCount > 0) {
            const updated = await FoodItemRepository.update(item.food_id, { status: 'OUT_OF_STOCK' });
            return {
                deactivated: true,
                message: 'Item has historical sales. It was deactivated (status changed to OUT_OF_STOCK) instead of deleted.',
                item: updated
            };
        }

        await item.destroy();
        return { deactivated: false, message: 'Food item deleted successfully' };
    }
}

module.exports = new FoodService();
