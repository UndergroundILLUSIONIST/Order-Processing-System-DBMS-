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
        
        // 1. Create order header
        const orderRes = await executeQuery(
            `INSERT INTO orders (customer_id, status, total_amount) VALUES (:customer_id, 'PENDING', 0)`,
            { customer_id }
        );
        
        const newOrderId = orderRes.lastInsertRowid;
        let orderTotal = 0;
        
        // 2. Insert items and update stock
        for (const item of items) {
            const prodId = item.product_id || item.PRODUCT_ID || item.id;
            const quantity = parseInt(item.quantity) || 1;
            
            // Fetch correct price directly from DB to prevent tampered payloads
            const productQuery = await executeQuery(`SELECT price, stock_quantity FROM products WHERE product_id = :prodId`, { prodId });
            
            if (productQuery.rows && productQuery.rows.length > 0) {
                const product = productQuery.rows[0];
                const unit_price = parseFloat(product.price) || 0;
                const subtotal = quantity * unit_price;
                
                orderTotal += subtotal;

                await executeQuery(
                    `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) 
                     VALUES (:order_id, :product_id, :quantity, :unit_price, :subtotal)`,
                    {
                        order_id: newOrderId,
                        product_id: prodId,
                        quantity: quantity,
                        unit_price: unit_price,
                        subtotal: subtotal
                    }
                );

                // Decrease stock quantity
                await executeQuery(
                    `UPDATE products SET stock_quantity = stock_quantity - :quantity WHERE product_id = :prodId`,
                    { quantity: quantity, prodId: prodId }
                );
            } else {
                console.warn(`Product ID ${prodId} not found during order creation.`);
            }
        }
        
        // 3. Update order with accurate total
        await executeQuery(
            `UPDATE orders SET total_amount = :total WHERE order_id = :orderId`,
            { total: orderTotal, orderId: newOrderId }
        );

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
