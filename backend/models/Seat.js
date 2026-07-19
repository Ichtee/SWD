const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Room = require('./Room');

const Seat = sequelize.define('Seat', {
    seat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.seat_id;
        }
    },
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Room,
            key: 'room_id'
        }
    },
    seat_row: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    seat_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    seat_type: {
        type: DataTypes.ENUM('NORMAL', 'VIP', 'COUPLE'),
        defaultValue: 'NORMAL'
    }
}, {
    tableName: 'seats',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['room_id', 'seat_row', 'seat_number']
        }
    ]
});

// Relationships
Room.hasMany(Seat, { foreignKey: 'room_id', onDelete: 'CASCADE' });
Seat.belongsTo(Room, { foreignKey: 'room_id' });

module.exports = Seat;
