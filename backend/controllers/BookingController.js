const BookingService = require('../services/BookingService');

class BookingController {
    async createBooking(req, res, next) {
        try {
            const booking = await BookingService.createBooking({
                ...req.body,
                user_id: req.user.user_id
            });
            res.status(201).json({
                message: 'Booking information saved successfully.',
                booking
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancelBooking(req, res, next) {
        try {
            await BookingService.cancelBooking(req.params.id, req.user);
            res.json({ message: 'Booking canceled successfully.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMyBookings(req, res, next) {
        try {
            const bookings = await BookingService.getMyBookings(req.user.user_id);
            res.json(bookings);
        } catch (error) {
            next(error);
        }
    }

    async getBookingById(req, res, next) {
        try {
            const booking = await BookingService.getBookingById(req.params.id, req.user);
            res.json(booking);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllBookings(req, res, next) {
        try {
            const bookings = await BookingService.getAllBookings(req.query);
            res.json(bookings);
        } catch (error) {
            next(error);
        }
    }

    async validateTicket(req, res, next) {
        try {
            const validated = await BookingService.validateTicket(req.body);
            res.json({
                message: 'Ticket validated successfully.',
                ticket: validated
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new BookingController();
