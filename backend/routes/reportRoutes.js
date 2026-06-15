const express = require('express');
const { getSalesReport, getInventoryReport } = require('../controllers/reportController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/sales', protect, admin, getSalesReport);
router.get('/inventory', protect, admin, getInventoryReport);

module.exports = router;
