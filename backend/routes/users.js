const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const UserFavoriteController = require('../controllers/UserFavoriteController');
const { protect, authorize } = require('../middlewares/auth');

// Profile routes
router.get('/profile', protect, UserController.getProfile);
router.put('/profile', protect, UserController.updateProfile);

// Favorites route
router.get('/favorites', protect, UserFavoriteController.getFavorites);

// Admin-only user management routes
router.get('/', protect, authorize('ADMIN'), UserController.getAllUsers);
router.get('/:id', protect, authorize('ADMIN'), UserController.getUserById);
router.put('/:id/role', protect, authorize('ADMIN'), UserController.updateUserRole);
router.put('/:id/status', protect, authorize('ADMIN'), UserController.updateUserStatus);

module.exports = router;
