const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { protect } = require('../middlewares/auth');

router.get('/movie/:movieId', ReviewController.getMovieReviews);
router.post('/', protect, ReviewController.createReview);

module.exports = router;
