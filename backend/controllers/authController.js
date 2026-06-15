const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/db');
const generateToken = require('../utils/jwt');
const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const registerUser = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, password } = req.body;

        const userExists = await executeQuery(`SELECT user_id FROM users WHERE username = :username`, { username });
        if (userExists.rows && userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await executeQuery(
            `INSERT INTO users (username, password_hash, role) VALUES (:username, :password_hash, 'CUSTOMER')`,
            { username, password_hash: hashedPassword },
            { autoCommit: true }
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, password } = req.body;

        const result = await executeQuery(`SELECT user_id, username, password_hash, role FROM users WHERE username = :username`, { username });
        
        if (!result.rows || result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        
        const isMatch = await bcrypt.compare(password, user.PASSWORD_HASH || user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.USER_ID || user.user_id, user.ROLE || user.role);

        res.json({
            user: {
                id: user.USER_ID || user.user_id,
                username: user.USERNAME || user.username,
                role: user.ROLE || user.role
            },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };
