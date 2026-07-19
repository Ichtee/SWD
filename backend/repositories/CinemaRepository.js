const { Cinema, Room } = require('../models');

class CinemaRepository {
    async findAll(whereClause = {}) {
        return await Cinema.findAll({
            where: whereClause,
            include: [{ model: Room }]
        });
    }

    async findById(cinema_id) {
        return await Cinema.findByPk(cinema_id, {
            include: [{ model: Room }]
        });
    }

    async create(data, transaction = null) {
        return await Cinema.create(data, { transaction });
    }

    async update(cinema_id, data, transaction = null) {
        const cinema = await Cinema.findByPk(cinema_id);
        if (!cinema) return null;
        return await cinema.update(data, { transaction });
    }

    async delete(cinema_id, transaction = null) {
        const cinema = await Cinema.findByPk(cinema_id);
        if (!cinema) return null;
        return await cinema.destroy({ transaction });
    }
}

module.exports = new CinemaRepository();
