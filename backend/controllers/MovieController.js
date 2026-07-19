const MovieService = require('../services/MovieService');
const UserFavoriteService = require('../services/UserFavoriteService');

class MovieController {
    async getMovies(req, res, next) {
        try {
            const movies = await MovieService.getMovies(req.query, req.user);
            res.json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getMovieById(req, res, next) {
        try {
            const movie = await MovieService.getMovieById(req.params.id);
            res.json(movie);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async createMovie(req, res, next) {
        try {
            const movie = await MovieService.createMovie(req.body);
            res.status(201).json(movie);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateMovie(req, res, next) {
        try {
            const movie = await MovieService.updateMovie(req.params.id, req.body);
            res.json(movie);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async deleteMovie(req, res, next) {
        try {
            const result = await MovieService.deleteMovie(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async favoriteMovie(req, res, next) {
        try {
            const movie_id = req.params.movieId;
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
            const movie_id = req.params.movieId;
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
}

module.exports = new MovieController();
