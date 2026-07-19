const AuthService = require('../services/AuthService');

class AuthController {
    async register(req, res, next) {
        try {
            const data = await AuthService.register(req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res, next) {
        try {
            const data = await AuthService.login(req.body);
            res.json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMe(req, res, next) {
        try {
            const data = await AuthService.getMe(req.user.user_id);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const data = await AuthService.forgotPassword(req.body.email);
            res.json({
                message: 'OTP sent to email. Please verify.',
                email: data.email,
                mockOtp: data.mockOtp
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async verifyOtp(req, res, next) {
        try {
            await AuthService.verifyOtp(req.body);
            res.json({ message: 'Account activated successfully.', verified: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async resetPassword(req, res, next) {
        try {
            await AuthService.resetPassword(req.body);
            res.json({ message: 'Password reset successfully.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
