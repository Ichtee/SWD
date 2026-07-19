const Review = require('../models/Review');
const User = require('../models/User');

class ReviewRepository {
    async create(reviewData) {
        return await Review.create(reviewData);
    }

    async findAllByMovie(movieId) {
        return await Review.findAll({
            where: { movie_id: movieId, status: 'VISIBLE' },
            include: [
                { model: User, attributes: ['full_name', 'avatar_url'] }
            ],
            order: [['created_at', 'DESC']]
        });
    }
}

module.exports = new ReviewRepository();
