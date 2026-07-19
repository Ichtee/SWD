const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_DIALECT === 'mysql') {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'cinema_db',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || '127.0.0.1',
            dialect: 'mysql',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
} else {
    // Default to SQLite
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || './database.sqlite',
        logging: console.log
    });
}

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`SQL Database connected successfully using ${sequelize.getDialect().toUpperCase()}`);
    } catch (error) {
        console.error('SQL Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
