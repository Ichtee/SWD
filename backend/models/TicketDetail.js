const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Booking = require('./Booking');
const Seat = require('./Seat');

const TicketDetail = sequelize.define('TicketDetail', {
    ticket_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.ticket_id;
        }
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Booking,
            key: 'booking_id'
        }
    },
    seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Seat,
            key: 'seat_id'
        }
    },
    final_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('VALID', 'USED', 'REFUNDED'),
        defaultValue: 'VALID'
    },
    qr_code: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ''
    }
}, {
    tableName: 'ticket_details',
    timestamps: false
});

// Relationships
Booking.hasMany(TicketDetail, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
TicketDetail.belongsTo(Booking, { foreignKey: 'booking_id' });

Seat.hasMany(TicketDetail, { foreignKey: 'seat_id' });
TicketDetail.belongsTo(Seat, { foreignKey: 'seat_id' });

module.exports = TicketDetail;
