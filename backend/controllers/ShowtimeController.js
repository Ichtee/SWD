const ShowtimeService = require('../services/ShowtimeService');

class ShowtimeController {
    async getShowtimes(req, res, next) {
        try {
            const showtimes = await ShowtimeService.getShowtimes(req.query);
            res.json(showtimes);
        } catch (error) {
            next(error);
        }
    }

    async getShowtimeById(req, res, next) {
        try {
            const showtime = await ShowtimeService.getShowtimeById(req.params.id);
            res.json(showtime);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getShowtimeSeats(req, res, next) {
        try {
            const data = await ShowtimeService.getShowtimeSeats(req.params.id);
            res.json(data);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async createShowtime(req, res, next) {
        try {
            const showtime = await ShowtimeService.createShowtime(req.body);
            res.status(201).json(showtime);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateShowtime(req, res, next) {
        try {
            const showtime = await ShowtimeService.updateShowtime(req.params.id, req.body);
            res.json(showtime);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteShowtime(req, res, next) {
        try {
            const result = await ShowtimeService.deleteShowtime(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new ShowtimeController();
