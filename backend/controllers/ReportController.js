const ReportService = require('../services/ReportService');

class ReportController {
    async getRevenueReport(req, res, next) {
        try {
            const report = await ReportService.getRevenueReport(req.query);
            res.json(report);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getSystemReport(req, res, next) {
        try {
            const report = await ReportService.getSystemReport();
            res.json(report);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();
