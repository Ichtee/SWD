const { sequelize } = require('../config/db');
const Cinema = require('./Cinema');
const User = require('./User');
const Movie = require('./Movie');
const Room = require('./Room');
const Seat = require('./Seat');
const Showtime = require('./Showtime');
const Booking = require('./Booking');
const TicketDetail = require('./TicketDetail');
const FoodItem = require('./FoodItem');
const FoodOrder = require('./FoodOrder');
const FoodOrderDetail = require('./FoodOrderDetail');
const Payment = require('./Payment');
const Review = require('./Review');
const UserFavorite = require('./UserFavorite');
const Notification = require('./Notification');

// Establish associations
Cinema.hasMany(Room, { foreignKey: 'cinema_id', onDelete: 'CASCADE' });
Room.belongsTo(Cinema, { foreignKey: 'cinema_id' });

User.belongsToMany(Movie, { through: UserFavorite, foreignKey: 'user_id', as: 'FavoriteMovies' });
Movie.belongsToMany(User, { through: UserFavorite, foreignKey: 'movie_id', as: 'FavoritedBy' });

// Package models together
const models = {
    Cinema,
    User,
    Movie,
    Room,
    Seat,
    Showtime,
    Booking,
    TicketDetail,
    FoodItem,
    FoodOrder,
    FoodOrderDetail,
    Payment,
    Review,
    UserFavorite,
    Notification
};

module.exports = {
    sequelize,
    ...models
};
