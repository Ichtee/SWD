const Notification = require('../models/Notification');

class NotificationRepository {
    async create(data) {
        return await Notification.create(data);
    }

    async findById(id) {
        return await Notification.findByPk(id);
    }

    async findAllByUser(userId) {
        return await Notification.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
    }

    async update(id, data) {
        const notif = await Notification.findByPk(id);
        if (!notif) return null;
        return await notif.update(data);
    }

    async markAllAsRead(userId) {
        return await Notification.update({ is_read: true }, { where: { user_id: userId, is_read: false } });
    }
}

module.exports = new NotificationRepository();
