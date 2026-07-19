const NotificationRepository = require('../repositories/NotificationRepository');

class NotificationService {
    async createNotification(userId, title, message) {
        if (!userId || !title || !message) {
            throw new Error('User ID, title, and message are required for notification');
        }
        return await NotificationRepository.create({
            user_id: userId,
            title,
            message,
            is_read: false
        });
    }

    async getUserNotifications(userId) {
        return await NotificationRepository.findAllByUser(userId);
    }

    async markAsRead(notificationId, userId) {
        const notif = await NotificationRepository.findById(notificationId);
        if (!notif) throw new Error('Notification not found');
        if (notif.user_id !== userId) throw new Error('Not authorized');

        return await NotificationRepository.update(notificationId, { is_read: true });
    }

    async markAllAsRead(userId) {
        return await NotificationRepository.markAllAsRead(userId);
    }
}

module.exports = new NotificationService();
