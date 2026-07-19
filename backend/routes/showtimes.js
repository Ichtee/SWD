const express = require('express');
const router = express.Router();
const ShowtimeController = require('../controllers/ShowtimeController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', ShowtimeController.getShowtimes);
router.get('/:id', ShowtimeController.getShowtimeById);
router.get('/:id/seats', ShowtimeController.getShowtimeSeats);

router.post('/', protect, authorize('MANAGER', 'ADMIN'), ShowtimeController.createShowtime);
router.put('/:id', protect, authorize('MANAGER', 'ADMIN'), ShowtimeController.updateShowtime);
router.delete('/:id', protect, authorize('MANAGER', 'ADMIN'), ShowtimeController.deleteShowtime);

module.exports = router;
