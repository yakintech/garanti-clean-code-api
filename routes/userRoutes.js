const userController = require('../controllers/userController');
const userRoutes = require('express').Router();
const { body, validationResult } = require('express-validator');



userRoutes.post('/token', userController.token);
userRoutes.get('/', userController.getAll);
userRoutes.post(
    '/token',
    [
        body('email').isEmail().notEmpty(),
        body('password').isString().notEmpty(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    userController.token
);

userRoutes.post("/", [
    body('email').isEmail().notEmpty(),
    body('password').isString().notEmpty(),
], userController.create);


module.exports = userRoutes;