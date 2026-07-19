const Booking = require('../models/Booking');
const TicketDetail = require('../models/TicketDetail');
const FoodOrderDetail = require('../models/FoodOrderDetail');
const FoodItem = require('../models/FoodItem');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const Seat = require('../models/Seat');
const User = require('../models/User');
const { Op } = require('sequelize');

class BookingRepository {
    async create(bookingData, transaction) {
        return await Booking.create(bookingData, { transaction });
    }

    async findById(id) {
        return await Booking.findByPk(id, {
            include: [
                { model: TicketDetail, include: [Seat] },
                { model: FoodOrderDetail, as: 'FoodOrderDetails', include: [{ model: FoodItem, as: 'item' }] },
                { model: Showtime, include: [Movie, Room] },
                { model: User, attributes: ['full_name', 'email', 'phone'] }
            ]
        });
    }

    async findActiveBookingsForSeats(showtimeId, seatIds) {
        return await Booking.findAll({
            where: {
                showtime_id: showtimeId,
                status: {
                    [Op.in]: ['PENDING', 'PAID']
                }
            },
            include: [
                {
                    model: TicketDetail,
                    where: {
                        seat_id: {
                            [Op.in]: seatIds
                        }
                    }
                }
            ]
        });
    }

    async update(id, updateData, transaction) {
        const booking = await Booking.findByPk(id);
        if (!booking) return null;
        return await booking.update(updateData, { transaction });
    }

    async findExpired(now) {
        return await Booking.findAll({
            where: {
                status: 'PENDING',
                expired_at: {
                    [Op.lt]: now
                }
            },
            include: [TicketDetail]
        });
    }

    async findAll(whereClause = {}) {
        return await Booking.findAll({
            where: whereClause,
            include: [
                { model: TicketDetail, include: [Seat] },
                { model: FoodOrderDetail, as: 'FoodOrderDetails', include: [{ model: FoodItem, as: 'item' }] },
                { model: Showtime, include: [Movie, Room] },
                { model: User, attributes: ['full_name', 'email'] }
            ],
            order: [['booking_date', 'DESC']]
        });
    }
}

module.exports = new BookingRepository();
