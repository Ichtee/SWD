const TicketDetail = require('../models/TicketDetail');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const Seat = require('../models/Seat');

class TicketDetailRepository {
    async create(ticketData, transaction) {
        return await TicketDetail.create(ticketData, { transaction });
    }

    async findByQrCode(qrCode) {
        const User = require('../models/User');
        return await TicketDetail.findOne({
            where: { qr_code: qrCode },
            include: [
                { model: Seat },
                {
                    model: Booking,
                    include: [
                        User,
                        {
                            model: Showtime,
                            include: [Movie, Room]
                        }
                    ]
                }
            ]
        });
    }

    async update(id, updateData, transaction) {
        const ticket = await TicketDetail.findByPk(id);
        if (!ticket) return null;
        return await ticket.update(updateData, { transaction });
    }
}

module.exports = new TicketDetailRepository();
