const express = require('express');
const router = express.Router();
const UserFavoriteController = require('../controllers/UserFavoriteController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, UserFavoriteController.getFavorites);
router.post('/', protect, UserFavoriteController.addFavorite);
router.delete('/:movie_id', protect, UserFavoriteController.removeFavorite);

module.exports = router;
