const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Movie = require('./Movie');
const Room = require('./Room');

const Showtime = sequelize.define('Showtime', {
    showtime_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.showtime_id;
        }
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Movie,
            key: 'movie_id'
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
    format_name: {
        type: DataTypes.STRING(30),
        defaultValue: '2D'
    },
    price_surcharge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('SCHEDULED', 'ONGOING', 'FINISHED', 'CANCELLED'),
        defaultValue: 'SCHEDULED'
    }
}, {
    tableName: 'showtimes',
    timestamps: false
});

// Relationships
Movie.hasMany(Showtime, { foreignKey: 'movie_id' });
Showtime.belongsTo(Movie, { foreignKey: 'movie_id' });

Room.hasMany(Showtime, { foreignKey: 'room_id' });
Showtime.belongsTo(Room, { foreignKey: 'room_id' });

module.exports = Showtime;
