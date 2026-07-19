const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, PaymentController.makePayment);

module.exports = router;
