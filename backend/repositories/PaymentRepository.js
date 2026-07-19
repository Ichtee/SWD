const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const FoodOrder = require('../models/FoodOrder');
const { Op } = require('sequelize');

class PaymentRepository {
    async create(paymentData, transaction) {
        return await Payment.create(paymentData, { transaction });
    }

    async findById(id) {
        return await Payment.findByPk(id, {
            include: [Booking, FoodOrder]
        });
    }

    async update(id, updateData, transaction) {
        const payment = await Payment.findByPk(id);
        if (!payment) return null;
        return await payment.update(updateData, { transaction });
    }

    async findRevenuePayments(startDate, endDate) {
        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T23:59:59.999Z`);
        return await Payment.findAll({
            where: {
                status: 'SUCCESS',
                payment_date: {
                    [Op.between]: [start, end]
                }
            },
            include: [
                {
                    model: Booking,
                    required: false
                },
                {
                    model: FoodOrder,
                    required: false
                }
            ]
        });
    }
}

module.exports = new PaymentRepository();
