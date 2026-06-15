const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super_secret_jwt_key_12345', {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};

module.exports = generateToken;
