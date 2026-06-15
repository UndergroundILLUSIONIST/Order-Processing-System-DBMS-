const { executeQuery } = require('../config/db');

const getSalesReport = async (req, res) => {
    try {
        const result = await executeQuery(`SELECT * FROM vw_sales_report`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getInventoryReport = async (req, res) => {
    try {
        const result = await executeQuery(`SELECT * FROM vw_inventory_status`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getSalesReport, getInventoryReport };
