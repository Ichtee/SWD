const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Showtime = require('./Showtime');

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.booking_id;
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    showtime_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Showtime,
            key: 'showtime_id'
        }
    },
    booking_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED', 'EXPIRED'),
        defaultValue: 'PENDING'
    },
    expired_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: ''
    }
}, {
    tableName: 'bookings',
    timestamps: false
});

// Relationships
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Showtime.hasMany(Booking, { foreignKey: 'showtime_id' });
Booking.belongsTo(Showtime, { foreignKey: 'showtime_id' });

module.exports = Booking;
