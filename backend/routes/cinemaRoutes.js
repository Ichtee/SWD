const express = require('express');
const router = express.Router();
const CinemaController = require('../controllers/CinemaController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', CinemaController.getAllCinemas);
router.get('/:id', CinemaController.getCinemaById);
router.post('/', protect, authorize('ADMIN', 'MANAGER'), CinemaController.createCinema);
router.put('/:id', protect, authorize('ADMIN', 'MANAGER'), CinemaController.updateCinema);
router.delete('/:id', protect, authorize('ADMIN'), CinemaController.deleteCinema);

module.exports = router;
