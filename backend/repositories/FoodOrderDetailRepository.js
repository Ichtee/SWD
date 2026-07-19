const FoodOrderDetail = require('../models/FoodOrderDetail');

class FoodOrderDetailRepository {
    async create(detailData, transaction) {
        return await FoodOrderDetail.create(detailData, { transaction });
    }
}

module.exports = new FoodOrderDetailRepository();
