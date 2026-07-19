const PaymentRepository = require('../repositories/PaymentRepository');
const BookingRepository = require('../repositories/BookingRepository');
const FoodOrderRepository = require('../repositories/FoodOrderRepository');
const TicketDetailRepository = require('../repositories/TicketDetailRepository');
const { sequelize } = require('../config/db');

class PaymentService {
    async makePayment({ booking_id, order_id, method }) {
        const transaction = await sequelize.transaction();
        try {
            if (!method) {
                throw new Error('Payment method is required');
            }

            let amount = 0;
            let booking = null;
            let foodOrder = null;

            if (booking_id) {
                booking = await BookingRepository.findById(booking_id);
                if (!booking) {
                    throw new Error('Booking record not found');
                }

                if (booking.status === 'PAID') {
                    throw new Error('This booking has already been paid.');
                }

                if (booking.status === 'CANCELLED' || booking.status === 'EXPIRED') {
                    throw new Error('Payment failed. Please try again.'); // MSG15
                }

                // Check expiration
                const now = new Date();
                const expiredAt = new Date(booking.expired_at);
                if (expiredAt <= now) {
                    await BookingRepository.update(booking.booking_id, { status: 'EXPIRED' }, transaction);
                    await transaction.commit();
                    throw new Error('Booking has expired. Seat hold released.');
                }

                amount = parseFloat(booking.total_price);
            } else if (order_id) {
                foodOrder = await FoodOrderRepository.findById(order_id);
                if (!foodOrder) {
                    throw new Error('Concessions order not found');
                }

                if (foodOrder.status === 'PAID') {
                    throw new Error('This order has already been paid.');
                }

                if (foodOrder.status === 'CANCELLED') {
                    throw new Error('Payment failed. Order is cancelled.');
                }

                amount = parseFloat(foodOrder.total_amount);
            } else {
                throw new Error('Provide booking_id or order_id to execute payment');
            }

            const transaction_id = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            const payment = await PaymentRepository.create({
                booking_id: booking_id || null,
                order_id: order_id || null,
                amount,
                method,
                status: 'SUCCESS',
                transaction_id,
                payment_date: new Date()
            }, transaction);

            if (booking) {
                await BookingRepository.update(booking.booking_id, { status: 'PAID' }, transaction);

                // If there's an associated FoodOrder, mark it as PAID too
                const foodOrders = await FoodOrderRepository.findAll({ booking_id: booking.booking_id });
                for (const fo of foodOrders) {
                    await FoodOrderRepository.update(fo.order_id, { status: 'PAID' }, transaction);
                }

                // Mark tickets as VALID
                if (booking.TicketDetails) {
                    for (const t of booking.TicketDetails) {
                        await TicketDetailRepository.update(t.ticket_id, { status: 'VALID' }, transaction);
                    }
                }
            } else if (foodOrder) {
                await FoodOrderRepository.update(foodOrder.order_id, { status: 'PAID' }, transaction);
            }

            await transaction.commit();

            try {
                const NotificationService = require('./NotificationService');
                if (booking) {
                    await NotificationService.createNotification(
                        booking.user_id,
                        'Booking Paid & Confirmed',
                        `Payment of ${parseFloat(booking.total_price).toLocaleString()} VND for "${booking.Showtime?.Movie?.title || 'Movie'}" (Booking ID: #${booking.booking_id}) was successful. Your e-tickets are ready!`
                    );
                } else if (foodOrder) {
                    await NotificationService.createNotification(
                        foodOrder.user_id,
                        'Concessions Order Paid',
                        `Payment of ${parseFloat(foodOrder.total_amount).toLocaleString()} VND for your concessions (Order ID: #${foodOrder.order_id}) was successful.`
                    );
                }
            } catch (err) {
                console.error('Failed to create payment notification:', err.message);
            }

            return {
                message: 'Payment completed successfully.', // MSG14
                ticketMessage: booking_id ? 'E-ticket generated successfully.' : null, // MSG16
                payment
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new PaymentService();
