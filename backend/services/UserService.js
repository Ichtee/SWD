const UserRepository = require('../repositories/UserRepository');
const { User, Booking, UserFavorite } = require('../models');

class UserService {
    async getAllUsers() {
        return await UserRepository.findAll();
    }

    async getUserById(id) {
        const user = await UserRepository.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    async updateUserRole(id, role) {
        const validRoles = ['ADMIN', 'STAFF', 'CUSTOMER', 'MANAGER'];
        if (!validRoles.includes(role)) {
            throw new Error('Invalid role specified');
        }
        const user = await UserRepository.findById(id);
        if (!user) throw new Error('User not found');
        
        await UserRepository.update(id, { role });
        return await UserRepository.findById(id);
    }

    async updateUserStatus(id, status) {
        const validStatuses = ['ACTIVE', 'LOCKED'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status specified');
        }
        const user = await UserRepository.findById(id);
        if (!user) throw new Error('User not found');

        await UserRepository.update(id, { status });
        return await UserRepository.findById(id);
    }

    async getUserProfile(userId) {
        const user = await User.findByPk(userId, {
            attributes: ['user_id', 'full_name', 'email', 'phone', 'role', 'status', 'avatar_url', 'created_at']
        });
        if (!user) throw new Error('User not found');

        const bookingCount = await Booking.count({ where: { user_id: userId } });
        const paidBookingCount = await Booking.count({ where: { user_id: userId, status: 'PAID' } });

        const favoriteCount = await UserFavorite.count({ where: { user_id: userId } });

        return {
            user,
            bookingSummary: {
                totalBookings: bookingCount,
                paidBookings: paidBookingCount
            },
            favoriteCount
        };
    }

    async updateUserProfile(userId, { fullName, phone, avatar }) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        const updates = {};
        if (fullName !== undefined) updates.full_name = fullName;
        if (phone !== undefined) updates.phone = phone;
        if (avatar !== undefined) updates.avatar_url = avatar;

        await user.update(updates);
        return user;
    }
}

module.exports = new UserService();
