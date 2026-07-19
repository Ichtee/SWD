const Seat = require('../models/Seat');

class SeatRepository {
    async findAllByRoomId(roomId) {
        return await Seat.findAll({ where: { room_id: roomId } });
    }

    async findByIds(ids) {
        return await Seat.findAll({ where: { seat_id: ids } });
    }

    async findById(id) {
        return await Seat.findByPk(id);
    }
}

module.exports = new SeatRepository();
