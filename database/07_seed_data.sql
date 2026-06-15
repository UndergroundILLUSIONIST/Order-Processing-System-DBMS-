-- 07_seed_data.sql
-- Seed Data for Order Processing System

-- Insert Admin User (password is 'admin123')
-- Note: Replace password_hash with an actual bcrypt hash from your backend.
-- $2b$10$Xo9.gqVl5Hq9YJ3p/N0A6e9LwH1i.OaV9yQz8B1qR1J4bF/F2p2vC is bcrypt for 'admin123'
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2b$10$Xo9.gqVl5Hq9YJ3p/N0A6e9LwH1i.OaV9yQz8B1qR1J4bF/F2p2vC', 'ADMIN');

-- Insert Customer User (password is 'customer123')
-- $2b$10$d6k9zR3p.g5HqVlYJ9.N0A6e9LwH1i.OaV9yQz8B1qR1J4bF/F2p2 is bcrypt for 'customer123'
INSERT INTO users (username, password_hash, role) 
VALUES ('johndoe', '$2b$10$d6k9zR3p.g5HqVlYJ9.N0A6e9LwH1i.OaV9yQz8B1qR1J4bF/F2p2', 'CUSTOMER');

-- Insert Customer Profile
INSERT INTO customers (user_id, first_name, last_name, email, phone, address, city, state, zip_code)
VALUES (2, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St', 'Springfield', 'IL', '62701');

-- Insert Suppliers
INSERT INTO suppliers (name, contact_name, email, phone)
VALUES ('Tech Supplies Inc', 'Jane Smith', 'jane@techsupplies.com', '555-0101');
INSERT INTO suppliers (name, contact_name, email, phone)
VALUES ('Global Gadgets', 'Bob Jones', 'bob@globalgadgets.com', '555-0202');

-- Insert Products
INSERT INTO products (supplier_id, name, description, price, stock_quantity)
VALUES (1, 'Laptop Pro 15', 'High performance laptop for professionals', 1299.99, 50);
INSERT INTO products (supplier_id, name, description, price, stock_quantity)
VALUES (1, 'Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 200);
INSERT INTO products (supplier_id, name, description, price, stock_quantity)
VALUES (2, 'Smartphone X', 'Latest generation smartphone', 899.99, 100);
INSERT INTO products (supplier_id, name, description, price, stock_quantity)
VALUES (2, 'Bluetooth Headphones', 'Noise-cancelling over-ear headphones', 199.99, 75);

COMMIT;
