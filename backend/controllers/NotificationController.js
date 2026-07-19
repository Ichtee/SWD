const NotificationService = require('../services/NotificationService');

class NotificationController {
    async getUserNotifications(req, res, next) {
        try {
            const notifications = await NotificationService.getUserNotifications(req.user.user_id);
            res.json({
                success: true,
                message: 'Notifications retrieved successfully.',
                data: notifications
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async markAsRead(req, res, next) {
        try {
            const { id } = req.params;
            await NotificationService.markAsRead(parseInt(id), req.user.user_id);
            res.json({
                success: true,
                message: 'Notification marked as read successfully.',
                data: null
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async markAllAsRead(req, res, next) {
        try {
            await NotificationService.markAllAsRead(req.user.user_id);
            res.json({
                success: true,
                message: 'All notifications marked as read.',
                data: null
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new NotificationController();
