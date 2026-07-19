const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_cinema_key_123456', {
        expiresIn: '30d'
    });
};

const otpStorage = new Map();

class AuthService {
    async register({ full_name, fullName, email, password, phone }) {
        const name = full_name || fullName;
        if (!name || !email || !password || !phone) {
            throw new Error('Username and password are required.');
        }

        const userExists = await UserRepository.findByEmail(email);
        if (userExists) {
            throw new Error('This email is already registered.');
        }

        const user = await UserRepository.create({
            full_name: name,
            email,
            password,
            phone,
            raw_password: password,
            role: 'CUSTOMER',
            status: 'ACTIVE'
        });

        return {
            token: generateToken(user.user_id),
            user: {
                id: user.user_id,
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        };
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new Error('Username and password are required.');
        }

        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid username or password.');
        }

        if (user.status === 'LOCKED') {
            throw new Error('You do not have permission to access this function.');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid username or password.');
        }

        return {
            token: generateToken(user.user_id),
            user: {
                id: user.user_id,
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        };
    }

    async getMe(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) throw new Error('User not found');
        return {
            id: user.user_id,
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status
        };
    }

    async forgotPassword(email) {
        if (!email) throw new Error('Email is required');

        const user = await UserRepository.findByEmail(email);
        if (!user) throw new Error('User with this email not found');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStorage.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

        console.log(`[MOCK EMAIL SERVICE] OTP for ${email}: ${otp}`);
        return { email, mockOtp: otp };
    }

    async verifyOtp({ email, otp }) {
        if (!email || !otp) throw new Error('Email and OTP are required');

        const record = otpStorage.get(email);
        if (!record || record.otp !== otp || Date.now() > record.expires) {
            throw new Error('Invalid or expired OTP code.');
        }

        return true;
    }

    async resetPassword({ email, otp, newPassword, password, confirmPassword }) {
        const resolvedPassword = newPassword || password;
        const resolvedConfirm = newPassword || confirmPassword;

        if (!email || !resolvedPassword || !resolvedConfirm) {
            throw new Error('All fields are required.');
        }

        if (resolvedPassword !== resolvedConfirm) {
            throw new Error('Password confirmation does not match.');
        }

        // Validate OTP if provided in request
        if (otp) {
            const record = otpStorage.get(email);
            if (!record || record.otp !== otp || Date.now() > record.expires) {
                throw new Error('Invalid or expired OTP code.');
            }
        }

        const user = await UserRepository.findByEmail(email);
        if (!user) throw new Error('User not found');

        await UserRepository.update(user.user_id, {
            password: resolvedPassword,
            raw_password: resolvedPassword
        });
        otpStorage.delete(email);
        return true;
    }
}

module.exports = new AuthService();
