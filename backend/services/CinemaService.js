const CinemaRepository = require('../repositories/CinemaRepository');

class CinemaService {
    async getAllCinemas(query = {}) {
        const whereClause = {};
        if (query.city) {
            whereClause.city = query.city;
        }
        if (query.status) {
            whereClause.status = query.status;
        }
        return await CinemaRepository.findAll(whereClause);
    }

    async getCinemaById(cinema_id) {
        const cinema = await CinemaRepository.findById(cinema_id);
        if (!cinema) {
            throw new Error('Cinema not found.');
        }
        return cinema;
    }

    async createCinema(data) {
        return await CinemaRepository.create(data);
    }

    async updateCinema(cinema_id, data) {
        return await CinemaRepository.update(cinema_id, data);
    }

    async deleteCinema(cinema_id) {
        return await CinemaRepository.delete(cinema_id);
    }
}

module.exports = new CinemaService();
