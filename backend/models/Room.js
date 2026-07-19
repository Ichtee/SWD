const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Room = sequelize.define('Room', {
    room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cinema_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cinemas',
            key: 'cinema_id'
        }
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.room_id;
        }
    },
    room_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    screen_type: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'MAINTENANCE', 'CLOSED'),
        defaultValue: 'ACTIVE'
    }
}, {
    tableName: 'rooms',
    timestamps: false
});

module.exports = Room;
