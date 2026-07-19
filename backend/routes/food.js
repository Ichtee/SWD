const express = require('express');
const router = express.Router();
const FoodController = require('../controllers/FoodController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', FoodController.getFoodItems);
router.post('/order', protect, FoodController.createFoodOrder);
router.post('/orders', protect, FoodController.createFoodOrder);
router.post('/counter-sale', protect, authorize('STAFF', 'MANAGER', 'ADMIN'), FoodController.createCounterSale);

router.post('/', protect, authorize('MANAGER', 'ADMIN'), FoodController.createFoodItem);
router.put('/:id', protect, authorize('MANAGER', 'ADMIN'), FoodController.updateFoodItem);
router.delete('/:id', protect, authorize('MANAGER', 'ADMIN'), FoodController.deleteFoodItem);

module.exports = router;
