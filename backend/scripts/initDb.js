const { initializeDb } = require('../config/db');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
    try {
        const db = await initializeDb();

        console.log('Creating tables...');
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'CUSTOMER',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS products (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                stock_quantity INTEGER DEFAULT 0,
                supplier_id INTEGER
            );

            CREATE TABLE IF NOT EXISTS orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER,
                order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'PENDING',
                total_amount REAL,
                FOREIGN KEY (customer_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS order_items (
                order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER,
                product_id INTEGER,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                subtotal REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(order_id),
                FOREIGN KEY (product_id) REFERENCES products(product_id)
            );

            CREATE VIEW IF NOT EXISTS vw_sales_report AS
            SELECT 
                o.order_id, 
                u.username AS customer_name,
                p.name AS product_name, 
                oi.quantity, 
                oi.subtotal,
                o.status
            FROM orders o
            JOIN users u ON o.customer_id = u.user_id
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.product_id;

            CREATE VIEW IF NOT EXISTS vw_inventory_status AS
            SELECT 
                name AS product_name, 
                'Default Supplier' AS supplier_name,
                price, 
                stock_quantity,
                CASE 
                    WHEN stock_quantity < 10 THEN 'LOW STOCK'
                    WHEN stock_quantity = 0 THEN 'OUT OF STOCK'
                    ELSE 'IN STOCK'
                END AS stock_status
            FROM products;
        `);

        console.log('Tables and Views created successfully.');

        // Seed Admin and Default User
        const adminHash = await bcrypt.hash('password123', 10);
        const userHash = await bcrypt.hash('customer123', 10);

        await db.run(`INSERT OR IGNORE INTO users (user_id, username, password_hash, role) VALUES (1, 'admin', ?, 'ADMIN')`, [adminHash]);
        await db.run(`INSERT OR IGNORE INTO users (user_id, username, password_hash, role) VALUES (2, 'johndoe', ?, 'CUSTOMER')`, [userHash]);

        // Seed Products if none exist
        const productCount = await db.get(`SELECT COUNT(*) as count FROM products`);
        if (productCount.count === 0) {
            await db.exec(`
                INSERT INTO products (name, description, price, stock_quantity, supplier_id) VALUES 
                ('Laptop Pro 15', 'High performance laptop for professionals', 1299.99, 50, 1),
                ('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 200, 1),
                ('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 89.99, 75, 2),
                ('4K Monitor', '32-inch 4K UHD Display', 399.99, 30, 2);
            `);
            console.log('Mock products seeded.');
        }

        console.log('Database initialization and seeding complete.');
    } catch (err) {
        console.error('Database setup failed:', err);
    }
};

if (require.main === module) {
    setupDatabase().then(() => process.exit(0));
}

module.exports = setupDatabase;
