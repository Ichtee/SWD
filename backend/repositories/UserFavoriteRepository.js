const UserFavorite = require('../models/UserFavorite');
const Movie = require('../models/Movie');

class UserFavoriteRepository {
    async create(data) {
        return await UserFavorite.create(data);
    }

    async findOne(whereClause) {
        return await UserFavorite.findOne({ where: whereClause });
    }

    async delete(whereClause) {
        return await UserFavorite.destroy({ where: whereClause });
    }

    async findAllByUser(userId) {
        return await UserFavorite.findAll({
            where: { user_id: userId },
            include: [{ model: Movie }]
        });
    }
}

module.exports = new UserFavoriteRepository();
