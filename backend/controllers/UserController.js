const UserService = require('../services/UserService');

class UserController {
    async getAllUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateUserRole(req, res, next) {
        try {
            const { role } = req.body;
            const user = await UserService.updateUserRole(req.params.id, role);
            res.json({ message: 'User role updated successfully.', user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUserStatus(req, res, next) {
        try {
            const { status } = req.body;
            const user = await UserService.updateUserStatus(req.params.id, status);
            res.json({ message: 'User status updated successfully.', user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getProfile(req, res, next) {
        try {
            const profileData = await UserService.getUserProfile(req.user.user_id);
            res.json({
                success: true,
                message: 'Profile retrieved successfully.',
                data: profileData
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { fullName, phone, avatar } = req.body;
            const user = await UserService.updateUserProfile(req.user.user_id, { fullName, phone, avatar });
            res.json({
                success: true,
                message: 'Profile updated successfully.',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
