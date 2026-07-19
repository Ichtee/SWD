const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FoodItem = sequelize.define('FoodItem', {
    food_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.food_id;
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('FOOD', 'DRINK', 'COMBO'),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('AVAILABLE', 'OUT_OF_STOCK'),
        defaultValue: 'AVAILABLE'
    },
    description: {
        type: DataTypes.STRING(300),
        allowNull: true,
        defaultValue: ''
    }
}, {
    tableName: 'food_items',
    timestamps: false
});

module.exports = FoodItem;
