//token middleware
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Middleware to handle authentication for incoming requests.
 * 
 * This middleware checks for the presence of a Bearer token in the 
 * Authorization header of the request. If the token is valid and 
 * corresponds to an active user, the request is allowed to proceed.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * 
 * @returns {void}
 * 
 * @throws {Error} If the token is invalid or the user is not active.
 */
const authMiddleware = async (req, res, next) => {

    if (req.path === '/api/users/token') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            let { email } = jsonwebtoken.verify(token, process.env.JWT_SECRET);

            //kullanıcı isActive true ise devam et
            var user = await User.findOne({ email, isActive: true });
            if (!user) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    return res.status(401).json({ message: 'Authorization header missing or malformed' });


}


module.exports = authMiddleware;