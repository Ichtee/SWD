const BookingRepository = require('../repositories/BookingRepository');
const FoodOrderRepository = require('../repositories/FoodOrderRepository');
const UserRepository = require('../repositories/UserRepository');
const MovieRepository = require('../repositories/MovieRepository');
const ShowtimeRepository = require('../repositories/ShowtimeRepository');
const PaymentRepository = require('../repositories/PaymentRepository');
const { Op } = require('sequelize');

class ReportService {
    async getRevenueReport({ startDate, endDate }) {
        if (!startDate || !endDate) {
            throw new Error('Please provide both startDate and endDate');
        }

        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T23:59:59.999Z`);

        // Paid bookings in date range
        const paidBookings = await BookingRepository.findAll({
            status: 'PAID',
            booking_date: {
                [Op.between]: [start, end]
            }
        });

        // Paid standalone concessions orders in date range
        const paidConcessions = await FoodOrderRepository.findAll({
            status: 'PAID',
            booking_id: null,
            created_at: {
                [Op.between]: [start, end]
            }
        });

        let ticketRevenue = 0;
        let standaloneFoodRevenue = 0;

        paidBookings.forEach(b => {
            ticketRevenue += parseFloat(b.total_price);
        });

        paidConcessions.forEach(f => {
            standaloneFoodRevenue += parseFloat(f.total_amount);
        });

        const totalRevenue = ticketRevenue + standaloneFoodRevenue;

        return {
            reportingPeriod: {
                start: startDate,
                end: endDate
            },
            summary: {
                ticket_booking_revenue: ticketRevenue,
                standalone_concessions_revenue: standaloneFoodRevenue,
                total_revenue: totalRevenue,
                paid_bookings_count: paidBookings.length,
                paid_standalone_food_orders_count: paidConcessions.length
            },
            generatedAt: new Date()
        };
    }

    async getSystemReport() {
        const users = await UserRepository.findAll();
        const customersCount = users.filter(u => u.role === 'CUSTOMER').length;
        const staffCount = users.filter(u => u.role === 'STAFF').length;
        const managersCount = users.filter(u => u.role === 'MANAGER').length;

        const movies = await MovieRepository.findAll();
        const showtimes = await ShowtimeRepository.findAll();

        const bookings = await BookingRepository.findAll();
        const paidBookings = bookings.filter(b => b.status === 'PAID').length;
        const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
        const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
        const expiredBookings = bookings.filter(b => b.status === 'EXPIRED').length;

        // Payment stats using sequelize direct count or model
        const PaymentModel = require('../models/Payment');
        const payments = await PaymentModel.findAll({ where: { status: 'SUCCESS' } });
        let totalCapturedAmount = 0;
        payments.forEach(p => {
            totalCapturedAmount += parseFloat(p.amount);
        });

        return {
            users: {
                customers: customersCount,
                staff: staffCount,
                managers: managersCount,
                total: customersCount + staffCount + managersCount
            },
            catalog: {
                movies: movies.length,
                showtimes: showtimes.length
            },
            bookings: {
                paid: paidBookings,
                pending: pendingBookings,
                cancelled: cancelledBookings,
                expired: expiredBookings,
                total: paidBookings + pendingBookings + cancelledBookings + expiredBookings
            },
            financials: {
                total_payments_captured: totalCapturedAmount,
                total_transactions_count: payments.length
            },
            generatedAt: new Date()
        };
    }
}

module.exports = new ReportService();
