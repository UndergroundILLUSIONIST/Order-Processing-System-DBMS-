const { executeQuery } = require('../config/db');

const getOrders = async (req, res) => {
    try {
        const result = await executeQuery(`SELECT * FROM orders`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const createOrder = async (req, res) => {
    try {
        const { customer_id, items } = req.body;
        // Basic example without full transaction handling for simplicity
        // 1. Create order header
        const orderRes = await executeQuery(
            `INSERT INTO orders (customer_id, status, total_amount) VALUES (:customer_id, 'PENDING', 0)`,
            { customer_id }
        );
        
        const newOrderId = orderRes.lastInsertRowid;
        
        // 2. Insert items
        for (const item of items) {
            await executeQuery(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) 
                 VALUES (:order_id, :product_id, :quantity, :unit_price, :subtotal)`,
                {
                    order_id: newOrderId,
                    product_id: item.product_id || item.PRODUCT_ID,
                    quantity: item.quantity,
                    unit_price: item.price || item.PRICE,
                    subtotal: item.quantity * (item.price || item.PRICE)
                }
            );
        }

        res.status(201).json({ message: 'Order created successfully', orderId: newOrderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const approveOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery(`UPDATE orders SET status = 'APPROVED' WHERE order_id = :id`, { id });
        res.json({ message: 'Order approved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

module.exports = { getOrders, createOrder, approveOrder };
