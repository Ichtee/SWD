const BookingRepository = require('../repositories/BookingRepository');
const TicketDetailRepository = require('../repositories/TicketDetailRepository');
const ShowtimeRepository = require('../repositories/ShowtimeRepository');
const SeatRepository = require('../repositories/SeatRepository');
const FoodItemRepository = require('../repositories/FoodItemRepository');
const FoodOrderRepository = require('../repositories/FoodOrderRepository');
const FoodOrderDetailRepository = require('../repositories/FoodOrderDetailRepository');
const UserRepository = require('../repositories/UserRepository');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

class BookingService {
    async createBooking({ showtime_id, showtimeId, seat_ids, seatIds, food_items, foods, notes, user_id }) {
        const resolvedShowtimeId = showtime_id || showtimeId;
        const resolvedSeatIds = seat_ids || seatIds;
        let resolvedFoodItems = food_items || [];
        if (foods && Array.isArray(foods)) {
            resolvedFoodItems = foods.map(f => ({
                food_id: f.foodId || f.food_id,
                quantity: f.quantity
            }));
        }

        const transaction = await sequelize.transaction();
        try {
            if (!resolvedShowtimeId || !resolvedSeatIds || !Array.isArray(resolvedSeatIds) || resolvedSeatIds.length === 0) {
                throw new Error('Please select at least one seat.'); // MSG09
            }

            // 1. Verify Showtime
            const showtime = await ShowtimeRepository.findById(resolvedShowtimeId);
            if (!showtime) {
                throw new Error('Showtime not found');
            }

            if (showtime.status === 'CANCELLED') {
                throw new Error('This showtime has been cancelled.');
            }

            // 2. Verify seats belong to room and are available
            const seats = await SeatRepository.findByIds(resolvedSeatIds);
            const invalidSeats = seats.filter(s => s.room_id !== showtime.room_id);
            if (seats.length !== resolvedSeatIds.length || invalidSeats.length > 0) {
                throw new Error('Some selected seats are invalid for this room.');
            }

            // Check if any seat is already booked/reserved
            const conflictingBookings = await BookingRepository.findActiveBookingsForSeats(showtime.showtime_id, resolvedSeatIds);
            if (conflictingBookings.length > 0) {
                throw new Error('This seat is no longer available.'); // MSG08
            }

            // 3. Compute ticket prices
            let ticketSubtotal = 0;
            const ticketDetailsData = [];

            for (const seat of seats) {
                let multiplier = 1.0;
                if (seat.seat_type === 'VIP') multiplier = 1.2;
                else if (seat.seat_type === 'COUPLE') multiplier = 1.5;

                const basePrice = parseFloat(showtime.base_price);
                const surcharge = parseFloat(showtime.price_surcharge);
                const final_price = (basePrice + surcharge) * multiplier;

                ticketSubtotal += final_price;
                ticketDetailsData.push({
                    seat_id: seat.seat_id,
                    final_price,
                    status: 'VALID',
                    qr_code: `TICKET-${showtime.showtime_id}-${seat.seat_id}-${Math.floor(Math.random() * 100000)}`
                });
            }

            // 4. Compute food prices
            let foodSubtotal = 0;
            const foodOrderDetailsData = [];

            if (resolvedFoodItems && Array.isArray(resolvedFoodItems) && resolvedFoodItems.length > 0) {
                const foodIds = resolvedFoodItems.map(item => item.food_id);
                const dbFoodItems = await FoodItemRepository.findAll({
                    food_id: { [Op.in]: foodIds },
                    status: 'AVAILABLE'
                });

                if (dbFoodItems.length !== resolvedFoodItems.length) {
                    throw new Error('Some food items are out of stock or invalid.');
                }

                for (const item of resolvedFoodItems) {
                    const dbFood = dbFoodItems.find(f => f.food_id === item.food_id);
                    const quantity = parseInt(item.quantity);
                    if (quantity <= 0) continue;

                    const price = parseFloat(dbFood.price);
                    foodSubtotal += price * quantity;
                    foodOrderDetailsData.push({
                        food_id: dbFood.food_id,
                        quantity,
                        unit_price: price
                    });
                }
            }

            const subtotal = ticketSubtotal + foodSubtotal;
            const discount_amount = 0.00;
            const total_price = subtotal - discount_amount;

            // 5. Create Booking
            const expired_at = new Date(Date.now() + 15 * 60 * 1000); // 15 mins timeout
            const booking = await BookingRepository.create({
                user_id,
                showtime_id: resolvedShowtimeId,
                subtotal,
                discount_amount,
                total_price,
                status: 'PENDING',
                expired_at,
                notes: notes || ''
            }, transaction);

            // 6. Create Ticket Details
            for (const ticket of ticketDetailsData) {
                await TicketDetailRepository.create({
                    booking_id: booking.booking_id,
                    seat_id: ticket.seat_id,
                    final_price: ticket.final_price,
                    status: ticket.status,
                    qr_code: ticket.qr_code
                }, transaction);
            }

            // 7. Create Food Order if items exist
            if (foodOrderDetailsData.length > 0) {
                const foodOrder = await FoodOrderRepository.create({
                    user_id,
                    booking_id: booking.booking_id,
                    total_amount: foodSubtotal,
                    status: 'PENDING'
                }, transaction);

                for (const detail of foodOrderDetailsData) {
                    await FoodOrderDetailRepository.create({
                        booking_id: booking.booking_id,
                        order_id: foodOrder.order_id,
                        food_id: detail.food_id,
                        quantity: detail.quantity,
                        unit_price: detail.unit_price
                    }, transaction);
                }
            }

            await transaction.commit();

            // Retrieve full details for response
            const fullBooking = await BookingRepository.findById(booking.booking_id);
            try {
                const NotificationService = require('./NotificationService');
                await NotificationService.createNotification(
                    user_id,
                    'Booking Hold Created',
                    `Your booking hold for "${fullBooking.Showtime?.Movie?.title || 'Movie'}" has been created. Please complete payment of ${parseFloat(fullBooking.total_price).toLocaleString()} VND within 15 minutes.`
                );
            } catch (err) {
                console.error('Failed to create booking notification:', err.message);
            }

            return fullBooking;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async cancelBooking(id, user) {
        const transaction = await sequelize.transaction();
        try {
            const booking = await BookingRepository.findById(id);
            if (!booking) throw new Error('Booking not found.');

            if (user.role === 'CUSTOMER' && booking.user_id !== user.id) {
                throw new Error('You do not have permission to access this function.');
            }

            const now = new Date();
            const showtimeStartTime = new Date(booking.Showtime.start_time);
            if (showtimeStartTime <= now) {
                throw new Error('Booking cannot be canceled after showtime starts.');
            }

            await BookingRepository.update(booking.booking_id, { status: 'CANCELLED' }, transaction);

            // Update associated TicketDetails
            if (booking.TicketDetails) {
                for (const t of booking.TicketDetails) {
                    await TicketDetailRepository.update(t.ticket_id, { status: 'REFUNDED' }, transaction);
                }
            }

            // Cancel Food Orders if linked
            const foodOrders = await FoodOrderRepository.findAll({ booking_id: booking.booking_id });
            for (const fo of foodOrders) {
                await FoodOrderRepository.update(fo.order_id, { status: 'CANCELLED' }, transaction);
            }

            await transaction.commit();
            try {
                const NotificationService = require('./NotificationService');
                await NotificationService.createNotification(
                    booking.user_id,
                    'Booking Cancelled',
                    `Your booking for "${booking.Showtime?.Movie?.title || 'Movie'}" (Booking ID: #${booking.booking_id}) has been cancelled successfully.`
                );
            } catch (err) {
                console.error('Failed to create cancellation notification:', err.message);
            }
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getMyBookings(userId) {
        return await BookingRepository.findAll({ user_id: userId });
    }

    async getBookingById(id, user) {
        const booking = await BookingRepository.findById(id);
        if (!booking) throw new Error('Booking not found');

        if (user.role === 'CUSTOMER' && booking.user_id !== user.user_id) {
            throw new Error('You do not have permission to access this function.');
        }

        return booking;
    }

    async getAllBookings({ search, status }) {
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }

        let bookings = await BookingRepository.findAll(whereClause);

        if (search) {
            const term = search.toLowerCase();
            bookings = bookings.filter(b => {
                const name = b.User?.full_name?.toLowerCase() || '';
                const email = b.User?.email?.toLowerCase() || '';
                return name.includes(term) || email.includes(term);
            });
        }

        return bookings;
    }

    async validateTicket({ qr_code, ticket_id }) {
        let ticket;
        if (ticket_id) {
            const temp = await TicketDetailRepository.findByQrCode(null); // dummy fetch
        }

        if (ticket_id) {
            ticket = await TicketDetailRepository.findByQrCode(null); // wait, we can't find by ID with this
        } else {
            ticket = await TicketDetailRepository.findByQrCode(qr_code);
        }

        if (!ticket && ticket_id) {
            const TicketDetailModel = require('../models/TicketDetail');
            const SeatModel = require('../models/Seat');
            const BookingModel = require('../models/Booking');
            const ShowtimeModel = require('../models/Showtime');
            const MovieModel = require('../models/Movie');
            const RoomModel = require('../models/Room');
            const UserModel = require('../models/User');
            ticket = await TicketDetailModel.findOne({
                where: { ticket_id: ticket_id },
                include: [
                    { model: SeatModel },
                    {
                        model: BookingModel,
                        include: [
                            UserModel,
                            {
                                model: ShowtimeModel,
                                include: [MovieModel, RoomModel]
                            }
                        ]
                    }
                ]
            });
        }

        if (!ticket && qr_code) {
            ticket = await TicketDetailRepository.findByQrCode(qr_code);
        }

        if (!ticket) throw new Error('Invalid ticket.');
        if (ticket.status === 'USED') throw new Error('Ticket has already been used.');
        if (ticket.status !== 'VALID' || ticket.Booking?.status !== 'PAID') {
            throw new Error('Invalid ticket.');
        }

        await TicketDetailRepository.update(ticket.ticket_id, { status: 'USED' });

        return {
            id: ticket.ticket_id,
            ticket_id: ticket.ticket_id,
            final_price: ticket.final_price,
            status: 'USED',
            movie_title: ticket.Booking?.Showtime?.Movie?.title || '',
            start_time: ticket.Booking?.Showtime?.start_time || '',
            room_name: ticket.Booking?.Showtime?.Room?.room_name || '',
            customer_name: ticket.Booking?.User?.full_name || ''
        };
    }
}

module.exports = new BookingService();
