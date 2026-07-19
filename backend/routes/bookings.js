const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/', protect, BookingController.createBooking);
router.post('/validate-ticket', protect, authorize('STAFF', 'MANAGER', 'ADMIN'), BookingController.validateTicket);
router.post('/:id/cancel', protect, BookingController.cancelBooking);
router.get('/my', protect, BookingController.getMyBookings);
router.get('/my-bookings', protect, BookingController.getMyBookings);
router.get('/:id', protect, BookingController.getBookingById);
router.get('/', protect, authorize('STAFF', 'MANAGER', 'ADMIN'), BookingController.getAllBookings);

module.exports = router;
