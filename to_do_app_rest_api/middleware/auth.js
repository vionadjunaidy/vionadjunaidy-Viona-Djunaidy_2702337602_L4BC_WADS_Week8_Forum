import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import * as process from 'process';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is required' });
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ 
            where: {
                _id: decoded._id
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found or token is invalid' });
        }

        // Check if token exists in user's tokens array
        const userTokens = user.tokens || [];
        const tokenExists = userTokens.some(t => t.token === token);
        
        if (!tokenExists) {
            return res.status(401).json({ message: 'Token is invalid or expired' });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Please authenticate' });
    }
};

export default auth;