//token middleware
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');

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