const Movie = require('../models/Movie');

class MovieRepository {
    async findAll(whereClause = {}, orderClause = []) {
        return await Movie.findAll({
            where: whereClause,
            order: orderClause
        });
    }

    async findById(id) {
        return await Movie.findByPk(id);
    }

    async create(movieData) {
        return await Movie.create(movieData);
    }

    async update(id, movieData) {
        const movie = await Movie.findByPk(id);
        if (!movie) return null;
        return await movie.update(movieData);
    }
}

module.exports = new MovieRepository();
