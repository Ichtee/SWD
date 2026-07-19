const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/db');
const errorHandler = require('./middlewares/error');

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect and Sync Database
connectDB();
// Sync database (in production we would use migrations, but force: false or alter: true is fine for local test)
sequelize.sync()
    .then(() => console.log('SQL Database models synchronized successfully.'))
    .catch(err => console.error('Database sync failed:', err));

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Cinema Management System API' });
});

// Wire routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/showtimes', require('./routes/showtimes'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/food', require('./routes/food'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/cinemas', require('./routes/cinemaRoutes'));


// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Node Express Server running on port ${PORT}`);
});
