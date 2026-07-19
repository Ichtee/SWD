const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Booking = require('./Booking');

const FoodOrder = sequelize.define('FoodOrder', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.order_id;
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
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Booking,
            key: 'booking_id'
        }
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED'),
        defaultValue: 'PENDING'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'food_orders',
    timestamps: false
});

// Relationships
User.hasMany(FoodOrder, { foreignKey: 'user_id' });
FoodOrder.belongsTo(User, { foreignKey: 'user_id' });

Booking.hasMany(FoodOrder, { foreignKey: 'booking_id' });
FoodOrder.belongsTo(Booking, { foreignKey: 'booking_id' });

module.exports = FoodOrder;
