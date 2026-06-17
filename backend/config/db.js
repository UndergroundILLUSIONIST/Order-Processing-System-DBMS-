const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

const initializeDb = async () => {
    if (!dbInstance) {
        dbInstance = await open({
            filename: path.join(__dirname, '..', 'database.sqlite'),
            driver: sqlite3.Database
        });
        console.log('SQLite Database connected successfully');
    }
    return dbInstance;
};

// Generic executeQuery to replace Oracle syntax wrapper
const executeQuery = async (sql, binds = {}) => {
    const db = await initializeDb();
    
    // Convert Oracle named binds (:name) to SQLite named binds ($name or @name)
    // Actually, SQLite driver supports named params natively, but they usually start with : or $ or @.
    // The `sqlite` package passes bindings straight to `sqlite3`. 
    // `sqlite3` natively supports `:name`! 
    
    // We just need to map the binds object keys to include the prefix if required by sqlite3, 
    // but `sqlite3` expects the object keys to exactly match the parameter name in SQL.
    // For example, if SQL has `:name`, the object must have `":name": value`
    const mappedBinds = {};
    for (const key in binds) {
        mappedBinds[`:${key}`] = binds[key];
    }

    const upperSql = sql.toUpperCase().trim();
    
    try {
        if (upperSql.startsWith('SELECT') || upperSql.startsWith('PRAGMA')) {
            const rows = await db.all(sql, mappedBinds);
            return { rows };
        } else {
            const result = await db.run(sql, mappedBinds);
            return { 
                rowsAffected: result.changes, 
                lastInsertRowid: result.lastID 
            };
        }
    } catch (err) {
        console.error('SQL Execution Error:', err.message, '\\nSQL:', sql, '\\xBinds:', mappedBinds);
        throw err;
    }
};

const getConnection = async () => {
    const db = await initializeDb();
    // Simulate Oracle transaction connection object
    return {
        execute: executeQuery,
        commit: async () => { /* SQLite runs autoCommit by default unless BEGIN TRANSACTION is explicitly executed */ },
        close: async () => { /* Connection pool handled by sqlite module */ },
        db
    };
};

module.exports = {
    initializeDb,
    executeQuery,
    getConnection
};
