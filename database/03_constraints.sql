-- 03_constraints.sql
-- Foreign Keys and Additional Constraints

ALTER TABLE customers
ADD CONSTRAINT fk_cust_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE products
ADD CONSTRAINT fk_prod_supp FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL;

ALTER TABLE products
ADD CONSTRAINT chk_prod_price CHECK (price >= 0);

ALTER TABLE products
ADD CONSTRAINT chk_prod_stock CHECK (stock_quantity >= 0);

ALTER TABLE orders
ADD CONSTRAINT fk_ord_cust FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE;

ALTER TABLE orders
ADD CONSTRAINT chk_ord_status CHECK (status IN ('PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED'));

ALTER TABLE order_items
ADD CONSTRAINT fk_oi_ord FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT fk_oi_prod FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT chk_oi_qty CHECK (quantity > 0);
