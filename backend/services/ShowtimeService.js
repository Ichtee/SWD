const ShowtimeRepository = require('../repositories/ShowtimeRepository');
const MovieRepository = require('../repositories/MovieRepository');
const RoomRepository = require('../repositories/RoomRepository');
const SeatRepository = require('../repositories/SeatRepository');
const BookingRepository = require('../repositories/BookingRepository');
const TicketDetailRepository = require('../repositories/TicketDetailRepository');
const { Op } = require('sequelize');

class ShowtimeService {
    async getShowtimes({ movie_id, date, room_id }) {
        const whereClause = {};

        if (movie_id) {
            whereClause.movie_id = parseInt(movie_id);
        }
        if (room_id) {
            whereClause.room_id = parseInt(room_id);
        }

        if (date) {
            const startOfDay = new Date(`${date}T00:00:00.000Z`);
            const endOfDay = new Date(`${date}T23:59:59.999Z`);
            whereClause.start_time = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        return await ShowtimeRepository.findAll(whereClause);
    }

    async getShowtimeById(id) {
        const showtime = await ShowtimeRepository.findById(id);
        if (!showtime) throw new Error('Showtime not found');
        return showtime;
    }

    async getShowtimeSeats(id) {
        const showtime = await ShowtimeRepository.findById(id);
        if (!showtime) throw new Error('Showtime not found');

        const seats = await SeatRepository.findAllByRoomId(showtime.room_id);
        
        // Find active bookings (PAID or PENDING & not expired)
        const now = new Date();
        const bookings = await BookingRepository.findAll({
            showtime_id: showtime.showtime_id,
            status: {
                [Op.in]: ['PAID', 'PENDING']
            }
        });

        // Filter out expired bookings manually since we couldn't filter in DB easily with complex logic
        const activeBookings = bookings.filter(b => {
            if (b.status === 'PAID') return true;
            return b.status === 'PENDING' && new Date(b.expired_at) > now;
        });

        const activeBookingIds = activeBookings.map(b => b.booking_id);

        let bookedSeatIds = [];
        if (activeBookingIds.length > 0) {
            // Find booked tickets
            // We can just iterate activeBookings and collect TicketDetails seat_ids
            activeBookings.forEach(b => {
                if (b.TicketDetails) {
                    b.TicketDetails.forEach(t => {
                        if (t.status === 'VALID' || t.status === 'USED') {
                            bookedSeatIds.push(t.seat_id);
                        }
                    });
                }
            });
        }

        const seatLayout = seats.map(seat => {
            const isBooked = bookedSeatIds.includes(seat.seat_id);
            return {
                id: seat.seat_id,
                seat_id: seat.seat_id,
                room_id: seat.room_id,
                seat_row: seat.seat_row,
                seat_number: seat.seat_number,
                seat_type: seat.seat_type,
                status: isBooked ? 'RESERVED' : 'AVAILABLE'
            };
        });

        const room = await RoomRepository.findById(showtime.room_id);

        return {
            showtime_id: showtime.showtime_id,
            room_name: room?.room_name || '',
            seats: seatLayout
        };
    }

    async createShowtime({ movie_id, room_id, format_name, price_surcharge, start_time, base_price }) {
        if (!movie_id || !room_id || !start_time || !base_price) {
            throw new Error('Missing required showtime fields');
        }

        const movie = await MovieRepository.findById(movie_id);
        if (!movie) throw new Error('Movie not found');

        const room = await RoomRepository.findById(room_id);
        if (!room) throw new Error('Cinema room not found');

        const startTimeDate = new Date(start_time);
        const endTimeDate = new Date(startTimeDate.getTime() + (movie.duration + 15) * 60 * 1000);

        // Check scheduling conflict
        const conflicts = await ShowtimeRepository.findOverlapping(room_id, startTimeDate, endTimeDate);
        if (conflicts.length > 0) {
            throw new Error('The selected cinema room already has a scheduled showtime during this period.');
        }

        return await ShowtimeRepository.create({
            movie_id,
            room_id,
            format_name: format_name || '2D',
            price_surcharge: price_surcharge || 0,
            start_time: startTimeDate,
            end_time: endTimeDate,
            base_price,
            status: 'SCHEDULED'
        });
    }

    async updateShowtime(id, showtimeData) {
        const showtime = await ShowtimeRepository.findById(id);
        if (!showtime) throw new Error('Showtime not found');

        const movie_id = showtimeData.movie_id || showtime.movie_id;
        const room_id = showtimeData.room_id || showtime.room_id;
        const start_time = showtimeData.start_time || showtime.start_time;

        const movie = await MovieRepository.findById(movie_id);
        if (!movie) throw new Error('Movie not found');

        const startTimeDate = new Date(start_time);
        const endTimeDate = new Date(startTimeDate.getTime() + (movie.duration + 15) * 60 * 1000);

        const conflicts = await ShowtimeRepository.findOverlapping(room_id, startTimeDate, endTimeDate, showtime.showtime_id);
        if (conflicts.length > 0) {
            throw new Error('The selected cinema room already has a scheduled showtime during this period.');
        }

        return await ShowtimeRepository.update(id, {
            ...showtimeData,
            end_time: endTimeDate
        });
    }

    async deleteShowtime(id) {
        const showtime = await ShowtimeRepository.findById(id);
        if (!showtime) throw new Error('Showtime not found');

        // Check if there are active bookings
        const bookings = await BookingRepository.findAll({ showtime_id: showtime.showtime_id });
        const activeBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'PAID');

        if (activeBookings.length > 0) {
            // Cancel instead
            const updated = await ShowtimeRepository.update(id, { status: 'CANCELLED' });
            
            // Cancel pending bookings
            for (const b of activeBookings) {
                if (b.status === 'PENDING') {
                    await BookingRepository.update(b.booking_id, { status: 'CANCELLED' });
                }
            }

            return {
                cancelled: true,
                message: 'Cannot delete this showtime because tickets have already been booked. Status changed to CANCELLED instead.',
                showtime: updated
            };
        }

        await ShowtimeRepository.delete(id);
        return { cancelled: false, message: 'Showtime deleted successfully' };
    }
}

module.exports = new ShowtimeService();
