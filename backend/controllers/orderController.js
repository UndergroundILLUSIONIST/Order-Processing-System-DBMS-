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
            `INSERT INTO orders (customer_id, status, total_amount) VALUES (:customer_id, 'PENDING', 0) RETURNING order_id INTO :order_id`,
            { customer_id, order_id: { type: require('oracledb').NUMBER, dir: require('oracledb').BIND_OUT } },
            { autoCommit: false }
        );
        
        const newOrderId = orderRes.outBinds.order_id[0];
        
        // 2. Insert items
        for (const item of items) {
            await executeQuery(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) 
                 VALUES (:order_id, :product_id, :quantity, :unit_price, :subtotal)`,
                {
                    order_id: newOrderId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    subtotal: item.quantity * item.unit_price
                },
                { autoCommit: false }
            );
        }

        // Commit transaction
        const connection = await require('oracledb').getConnection();
        await connection.commit();
        await connection.close();

        res.status(201).json({ message: 'Order created successfully', orderId: newOrderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const approveOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery(`BEGIN prc_approve_order(:id); END;`, { id }, { autoCommit: true });
        res.json({ message: 'Order approved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

module.exports = { getOrders, createOrder, approveOrder };
