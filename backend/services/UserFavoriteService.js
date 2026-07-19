const UserFavoriteRepository = require('../repositories/UserFavoriteRepository');
const MovieRepository = require('../repositories/MovieRepository');
const { UserFavorite, Movie, User } = require('../models');

class UserFavoriteService {
    async addFavorite(userId, movieId) {
        const movie = await MovieRepository.findById(movieId);
        if (!movie) throw new Error('Movie not found');

        const existing = await UserFavoriteRepository.findOne({ user_id: userId, movie_id: movieId });
        if (existing) {
            return existing; // already favorited
        }

        return await UserFavoriteRepository.create({ user_id: userId, movie_id: movieId });
    }

    async removeFavorite(userId, movieId) {
        return await UserFavoriteRepository.delete({ user_id: userId, movie_id: movieId });
    }

    async getFavorites(userId) {
        const user = await User.findByPk(userId, {
            include: [{
                model: Movie,
                as: 'FavoriteMovies',
                through: { attributes: [] }
            }]
        });
        return user ? user.FavoriteMovies : [];
    }
}

module.exports = new UserFavoriteService();
