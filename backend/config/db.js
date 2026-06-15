const oracledb = require('oracledb');

// Configure oracledb to return strings for dates, or numbers for numeric columns if preferred
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true; 

const dbConfig = {
    user: process.env.DB_USER || 'order_user',
    password: process.env.DB_PASSWORD || 'your_password',
    connectString: process.env.DB_CONNECTION_STRING || 'localhost:1521/XEPDB1',
};

let pool;

const initializeDb = async () => {
    try {
        pool = await oracledb.createPool({
            ...dbConfig,
            poolMin: 2,
            poolMax: 10,
            poolIncrement: 1
        });
    } catch (err) {
        console.error('Error initializing database pool:', err);
        throw err;
    }
};

const executeQuery = async (sql, binds = {}, options = {}) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(sql, binds, options);
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

module.exports = {
    initializeDb,
    executeQuery
};
