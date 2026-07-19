const ReviewRepository = require('../repositories/ReviewRepository');
const MovieRepository = require('../repositories/MovieRepository');
const BookingRepository = require('../repositories/BookingRepository');
const { Booking, Showtime } = require('../models');

class ReviewService {
    async createReview({ user_id, movie_id, booking_id, rating, comment, image_url }) {
        if (!movie_id || !rating) {
            throw new Error('Movie ID and rating are required.');
        }

        const movie = await MovieRepository.findById(movie_id);
        if (!movie) throw new Error('Movie not found');

        const rateVal = parseInt(rating);
        if (isNaN(rateVal) || rateVal < 1 || rateVal > 5) {
            throw new Error('Rating must be between 1 and 5.');
        }

        // Require that the user must have a successful (PAID) booking for this movie
        const userHasPaidBooking = await Booking.findOne({
            where: {
                user_id,
                status: 'PAID'
            },
            include: [{
                model: Showtime,
                required: true,
                where: { movie_id }
            }]
        });
        if (!userHasPaidBooking) {
            throw new Error('Review is only allowed after a successful booking for this movie.');
        }

        // Optional booking validation: if booking_id is provided, verify it belongs to the user and is PAID
        if (booking_id) {
            const booking = await BookingRepository.findById(booking_id);
            if (!booking || booking.user_id !== user_id || booking.status !== 'PAID') {
                throw new Error('Invalid booking reference.');
            }
        }

        return await ReviewRepository.create({
            user_id,
            movie_id,
            booking_id: booking_id || null,
            rating: rateVal,
            comment: comment || '',
            image_url: image_url || '',
            status: 'VISIBLE'
        });
    }

    async getMovieReviews(movieId) {
        return await ReviewRepository.findAllByMovie(movieId);
    }
}

module.exports = new ReviewService();
