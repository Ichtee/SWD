const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const UserFavoriteController = require('../controllers/UserFavoriteController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', MovieController.getMovies);
router.get('/:id', MovieController.getMovieById);

// Favorites nested under movies route
router.post('/:movieId/favorite', protect, MovieController.favoriteMovie);
router.delete('/:movieId/favorite', protect, MovieController.removeFavorite);

// Manager movie CRUD
router.post('/', protect, authorize('MANAGER', 'ADMIN'), MovieController.createMovie);
router.put('/:id', protect, authorize('MANAGER', 'ADMIN'), MovieController.updateMovie);
router.delete('/:id', protect, authorize('MANAGER', 'ADMIN'), MovieController.deleteMovie);

module.exports = router;
