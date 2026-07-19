const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/revenue', protect, authorize('MANAGER', 'ADMIN'), ReportController.getRevenueReport);
router.get('/system', protect, authorize('ADMIN'), ReportController.getSystemReport);

module.exports = router;
