const PaymentService = require('../services/PaymentService');

class PaymentController {
    async makePayment(req, res, next) {
        try {
            const result = await PaymentService.makePayment(req.body);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();
