const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Booking = require('./Booking');
const FoodOrder = require('./FoodOrder');

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.payment_id;
        }
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Booking,
            key: 'booking_id'
        }
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: FoodOrder,
            key: 'order_id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'),
        defaultValue: 'PENDING'
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: ''
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'payments',
    timestamps: false
});

// Relationships
Booking.hasMany(Payment, { foreignKey: 'booking_id' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

FoodOrder.hasMany(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(FoodOrder, { foreignKey: 'order_id' });

module.exports = Payment;
