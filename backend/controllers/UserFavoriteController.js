const UserFavoriteService = require('../services/UserFavoriteService');

class UserFavoriteController {
    async addFavorite(req, res, next) {
        try {
            const movie_id = req.body.movie_id || req.params.movieId;
            if (!movie_id) {
                return res.status(400).json({ success: false, message: 'Movie ID is required.' });
            }
            const favorite = await UserFavoriteService.addFavorite(req.user.user_id, parseInt(movie_id));
            res.status(201).json({
                success: true,
                message: 'Movie added to favorites successfully.',
                data: favorite
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async removeFavorite(req, res, next) {
        try {
            const movie_id = req.params.movie_id || req.params.movieId;
            if (!movie_id) {
                return res.status(400).json({ success: false, message: 'Movie ID is required.' });
            }
            await UserFavoriteService.removeFavorite(req.user.user_id, parseInt(movie_id));
            res.json({
                success: true,
                message: 'Movie removed from favorites successfully.',
                data: null
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getFavorites(req, res, next) {
        try {
            const favorites = await UserFavoriteService.getFavorites(req.user.user_id);
            res.json({
                success: true,
                message: 'Favorites list retrieved successfully.',
                data: favorites
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new UserFavoriteController();
