const MovieRepository = require('../repositories/MovieRepository');
const ShowtimeRepository = require('../repositories/ShowtimeRepository');
const BookingRepository = require('../repositories/BookingRepository');
const { Op } = require('sequelize');

class MovieService {
    async getMovies({ status, category, search }, user) {
        const whereClause = {};
        const isClient = !user || user.role === 'CUSTOMER';

        if (status) {
            whereClause.status = status;
        } else if (isClient) {
            whereClause.status = {
                [Op.in]: ['SHOWING', 'COMING_SOON']
            };
        }

        if (category) {
            whereClause.categories = {
                [Op.like]: `%${category}%`
            };
        }

        if (search) {
            whereClause.title = {
                [Op.like]: `%${search}%`
            };
        }

        return await MovieRepository.findAll(whereClause, [['release_date', 'DESC']]);
    }

    async getMovieById(id) {
        const movie = await MovieRepository.findById(id);
        if (!movie) throw new Error('Movie not found');
        return movie;
    }

    async createMovie(movieData) {
        if (!movieData.title || !movieData.duration) {
            throw new Error('Title and duration are required.');
        }
        return await MovieRepository.create({
            ...movieData,
            age_rating: movieData.age_rating || 'P',
            status: movieData.status || 'COMING_SOON'
        });
    }

    async updateMovie(id, movieData) {
        const movie = await MovieRepository.update(id, movieData);
        if (!movie) throw new Error('Movie not found');
        return movie;
    }

    async deleteMovie(id) {
        const movie = await MovieRepository.findById(id);
        if (!movie) throw new Error('Movie not found');

        const showtimes = await ShowtimeRepository.findAll({ movie_id: movie.movie_id });
        const showtimeIds = showtimes.map(st => st.showtime_id);

        let hasBookings = false;
        if (showtimeIds.length > 0) {
            // Use BookingRepository.findAll to check count
            const bookings = await BookingRepository.findAll({
                showtime_id: { [Op.in]: showtimeIds }
            });
            if (bookings.length > 0) {
                hasBookings = true;
            }
        }

        if (hasBookings) {
            const updated = await MovieRepository.update(movie.movie_id, { status: 'ENDED' });
            return {
                deactivated: true,
                message: 'Movie has booking records. It was deactivated (status changed to ENDED) instead of deleted.',
                movie: updated
            };
        }

        await movie.destroy();
        return { deactivated: false, message: 'Movie deleted successfully' };
    }
}

module.exports = new MovieService();
