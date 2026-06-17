// MOCK DATABASE LAYER
// This replaces the actual oracledb connection so the UI can function without Oracle installed.

const bcrypt = require('bcryptjs');

// Mock Data Storage
const mockData = {
    users: [
        { USER_ID: 1, USERNAME: 'admin', PASSWORD_HASH: '$2a$10$JIpmXswu67bb79xTYnZAeO/P0lFm/tyQu7bJnpmEIF3cVMMdW2eBu', ROLE: 'ADMIN' },
        { USER_ID: 2, USERNAME: 'johndoe', PASSWORD_HASH: '$2a$10$KAZQBafWmnhdbZnA4fgfsufphgNpko.zsJD43YXpt.akiGeioLu6u', ROLE: 'CUSTOMER' }
    ],
    products: [
        { PRODUCT_ID: 1, NAME: 'Laptop Pro 15', DESCRIPTION: 'High performance laptop', PRICE: 1299.99, STOCK_QUANTITY: 50 },
        { PRODUCT_ID: 2, NAME: 'Wireless Mouse', DESCRIPTION: 'Ergonomic wireless mouse', PRICE: 29.99, STOCK_QUANTITY: 200 }
    ],
    orders: [
        { ORDER_ID: 1, CUSTOMER_ID: 2, STATUS: 'PENDING', TOTAL_AMOUNT: 1299.99 }
    ],
    sales: [
        { ORDER_ID: 1, CUSTOMER_NAME: 'John Doe', PRODUCT_NAME: 'Laptop Pro 15', QUANTITY: 1, SUBTOTAL: 1299.99, STATUS: 'PENDING' }
    ],
    inventory: [
        { PRODUCT_NAME: 'Laptop Pro 15', SUPPLIER_NAME: 'Tech Supplies Inc', PRICE: 1299.99, STOCK_QUANTITY: 50, STOCK_STATUS: 'IN STOCK' }
    ]
};

const initializeDb = async () => {
    console.log('Mock Database Initialized (Bypassing Oracle)');
};

const executeQuery = async (sql, binds = {}, options = {}) => {
    const upperSql = sql.toUpperCase();
    
    // Login User
    if (upperSql.includes('SELECT USER_ID, USERNAME, PASSWORD_HASH, ROLE FROM USERS')) {
        const user = mockData.users.find(u => u.USERNAME === binds.username);
        return { rows: user ? [user] : [] };
    }
    
    // Check if user exists (Registration)
    if (upperSql.includes('SELECT USER_ID FROM USERS WHERE USERNAME')) {
        const user = mockData.users.find(u => u.USERNAME === binds.username);
        return { rows: user ? [user] : [] };
    }
    
    // Get all products
    if (upperSql.includes('FROM PRODUCTS') && !upperSql.includes('WHERE')) {
        return { rows: mockData.products };
    }
    
    // Get all orders
    if (upperSql.includes('SELECT * FROM ORDERS')) {
        return { rows: mockData.orders };
    }
    
    // Sales Report
    if (upperSql.includes('VW_SALES_REPORT')) {
        return { rows: mockData.sales };
    }
    
    // Inventory Report
    if (upperSql.includes('VW_INVENTORY_STATUS')) {
        return { rows: mockData.inventory };
    }
    
    // Insert Product
    if (upperSql.includes('INSERT INTO PRODUCTS')) {
        const newProduct = {
            PRODUCT_ID: mockData.products.length + 1,
            NAME: binds.name,
            DESCRIPTION: binds.description,
            PRICE: binds.price,
            STOCK_QUANTITY: binds.stock_quantity
        };
        mockData.products.push(newProduct);
        return { rowsAffected: 1 };
    }
    
    // Insert/Approve mock logic
    if (upperSql.includes('INSERT INTO ORDERS')) {
        const newId = mockData.orders.length + 1;
        mockData.orders.push({
            ORDER_ID: newId,
            CUSTOMER_ID: binds.customer_id,
            STATUS: 'PENDING',
            TOTAL_AMOUNT: 0
        });
        return { outBinds: { order_id: [newId] } };
    }

    if (upperSql.includes('PRC_APPROVE_ORDER')) {
        const order = mockData.orders.find(o => o.ORDER_ID == binds.id);
        if (order) order.STATUS = 'APPROVED';
        return { rowsAffected: 1 };
    }

    // Default fallback
    return { rows: [] };
};

// Also mock getConnection for transaction logic in orderController.js
module.exports = {
    initializeDb,
    executeQuery,
    getConnection: async () => ({
        execute: executeQuery,
        commit: async () => {},
        close: async () => {}
    })
};
