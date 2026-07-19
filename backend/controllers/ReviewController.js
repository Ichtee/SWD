const ReviewService = require('../services/ReviewService');

class ReviewController {
    async createReview(req, res, next) {
        try {
            const { movie_id, booking_id, rating, comment, image_url } = req.body;
            const review = await ReviewService.createReview({
                user_id: req.user.user_id,
                movie_id,
                booking_id,
                rating,
                comment,
                image_url
            });
            res.status(201).json({
                success: true,
                message: 'Review submitted successfully.',
                data: review
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getMovieReviews(req, res, next) {
        try {
            const { movieId } = req.params;
            const reviews = await ReviewService.getMovieReviews(parseInt(movieId));
            res.json({
                success: true,
                message: 'Movie reviews retrieved successfully.',
                data: reviews
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ReviewController();
