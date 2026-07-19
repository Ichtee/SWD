const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Booking = require('./Booking');
const FoodOrder = require('./FoodOrder');
const FoodItem = require('./FoodItem');

const FoodOrderDetail = sequelize.define('FoodOrderDetail', {
    order_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.order_detail_id;
        }
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // linked to booking as per ER diagram
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
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: FoodItem,
            key: 'food_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'food_order_details',
    timestamps: false
});

// Relationships
Booking.hasMany(FoodOrderDetail, { foreignKey: 'booking_id', as: 'FoodOrderDetails', onDelete: 'CASCADE' });
FoodOrderDetail.belongsTo(Booking, { foreignKey: 'booking_id' });

FoodOrder.hasMany(FoodOrderDetail, { foreignKey: 'order_id', as: 'details', onDelete: 'CASCADE' });
FoodOrderDetail.belongsTo(FoodOrder, { foreignKey: 'order_id' });

FoodItem.hasMany(FoodOrderDetail, { foreignKey: 'food_id' });
FoodOrderDetail.belongsTo(FoodItem, { foreignKey: 'food_id', as: 'item' });

module.exports = FoodOrderDetail;
