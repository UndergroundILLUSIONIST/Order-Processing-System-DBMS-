const express = require('express');
const { getOrders, createOrder, approveOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getOrders);
router.post('/', protect, createOrder);
router.put('/:id/approve', protect, admin, approveOrder);

module.exports = router;
