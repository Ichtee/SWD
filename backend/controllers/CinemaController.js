const CinemaService = require('../services/CinemaService');

class CinemaController {
    async getAllCinemas(req, res, next) {
        try {
            const cinemas = await CinemaService.getAllCinemas(req.query);
            res.json(cinemas);
        } catch (error) {
            next(error);
        }
    }

    async getCinemaById(req, res, next) {
        try {
            const cinema = await CinemaService.getCinemaById(req.params.id);
            res.json(cinema);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async createCinema(req, res, next) {
        try {
            const cinema = await CinemaService.createCinema(req.body);
            res.status(201).json(cinema);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateCinema(req, res, next) {
        try {
            const cinema = await CinemaService.updateCinema(req.params.id, req.body);
            res.json(cinema);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteCinema(req, res, next) {
        try {
            await CinemaService.deleteCinema(req.params.id);
            res.json({ message: 'Cinema deleted successfully.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new CinemaController();
