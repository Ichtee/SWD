const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const { Op } = require('sequelize');

class ShowtimeRepository {
    async findAll(whereClause = {}, orderClause = [['start_time', 'ASC']]) {
        return await Showtime.findAll({
            where: whereClause,
            include: [
                { model: Movie, attributes: ['title', 'duration', 'poster_url', 'age_rating'] },
                { model: Room, attributes: ['room_name', 'capacity'] }
            ],
            order: orderClause
        });
    }

    async findById(id) {
        return await Showtime.findByPk(id, {
            include: [Movie, Room]
        });
    }

    async create(showtimeData) {
        return await Showtime.create(showtimeData);
    }

    async update(id, showtimeData) {
        const showtime = await Showtime.findByPk(id);
        if (!showtime) return null;
        return await showtime.update(showtimeData);
    }

    async delete(id) {
        const showtime = await Showtime.findByPk(id);
        if (!showtime) return false;
        await showtime.destroy();
        return true;
    }

    async findOverlapping(roomId, startTime, endTime, excludeId = null) {
        const whereClause = {
            room_id: roomId,
            status: 'SCHEDULED',
            [Op.or]: [
                {
                    start_time: {
                        [Op.lt]: endTime
                    },
                    end_time: {
                        [Op.gt]: startTime
                    }
                }
            ]
        };

        if (excludeId) {
            whereClause.showtime_id = { [Op.ne]: excludeId };
        }

        return await Showtime.findAll({ where: whereClause });
    }
}

module.exports = new ShowtimeRepository();
