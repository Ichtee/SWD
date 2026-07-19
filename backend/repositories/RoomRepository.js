const Room = require('../models/Room');

class RoomRepository {
    async findAll() {
        return await Room.findAll();
    }

    async findById(id) {
        return await Room.findByPk(id);
    }

    async create(roomData) {
        return await Room.create(roomData);
    }
}

module.exports = new RoomRepository();
