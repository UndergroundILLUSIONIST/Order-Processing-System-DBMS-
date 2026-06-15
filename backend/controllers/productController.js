const { executeQuery } = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const result = await executeQuery(`SELECT product_id, name, description, price, stock_quantity FROM products`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await executeQuery(`SELECT * FROM products WHERE product_id = :id`, { id });
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, supplier_id } = req.body;
        await executeQuery(
            `INSERT INTO products (name, description, price, stock_quantity, supplier_id) VALUES (:name, :description, :price, :stock_quantity, :supplier_id)`,
            { name, description, price, stock_quantity, supplier_id },
            { autoCommit: true }
        );
        res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProducts, getProductById, createProduct };
