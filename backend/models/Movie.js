const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Movie = sequelize.define('Movie', {
    movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.movie_id;
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    categories: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ''
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    poster_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    banner_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    trailer_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    language: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    director: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    cast: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    age_rating: {
        type: DataTypes.STRING(10),
        defaultValue: 'P'
    },
    status: {
        type: DataTypes.ENUM('COMING_SOON', 'SHOWING', 'ENDED'),
        defaultValue: 'COMING_SOON'
    }
}, {
    tableName: 'movies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Movie;
