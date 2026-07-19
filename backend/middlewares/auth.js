const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const parts = req.headers.authorization.split(' ');
            token = parts[2] || parts[1];

            if (!token) {
                return res.status(401).json({ error: 'Not authorized, token missing' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_cinema_key_123456');

            req.user = await User.findByPk(decoded.id);
            if (req.user) {
                req.user.id = req.user.user_id;
            }

            if (!req.user) {
                return res.status(401).json({ error: 'User no longer exists' });
            }

            if (req.user.status === 'LOCKED') {
                return res.status(403).json({ error: 'Your account has been locked.' });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }
    } else {
        return res.status(401).json({ error: 'Not authorized, no token provided.' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to access this function.' });
        }
        next();
    };
};

module.exports = { protect, authorize };
