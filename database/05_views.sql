-- 05_views.sql
-- Views for reporting

CREATE OR REPLACE VIEW vw_sales_report AS
SELECT 
    o.order_id,
    o.order_date,
    c.first_name || ' ' || c.last_name AS customer_name,
    p.name AS product_name,
    oi.quantity,
    oi.unit_price,
    oi.subtotal,
    o.status
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;

CREATE OR REPLACE VIEW vw_inventory_status AS
SELECT 
    p.product_id,
    p.name AS product_name,
    s.name AS supplier_name,
    p.price,
    p.stock_quantity,
    CASE 
        WHEN p.stock_quantity = 0 THEN 'OUT OF STOCK'
        WHEN p.stock_quantity < 10 THEN 'LOW STOCK'
        ELSE 'IN STOCK'
    END AS stock_status
FROM products p
LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id;
