const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, NotificationController.getUserNotifications);
router.put('/:id/read', protect, NotificationController.markAsRead);
router.put('/mark-all-read', protect, NotificationController.markAllAsRead);

module.exports = router;
