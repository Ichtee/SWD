const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cinema = sequelize.define('Cinema', {
    cinema_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.cinema_id;
        }
    },
    cinema_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'ACTIVE'
    }
}, {
    tableName: 'cinemas',
    timestamps: false
});

module.exports = Cinema;
