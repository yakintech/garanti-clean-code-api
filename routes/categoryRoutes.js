
const categoryRoutes = require('express').Router();
const categoryController = require('../controllers/categoryControllers');
const { body, validationResult } = require('express-validator');
const validate = require('../middleware/validationMiddleware');

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters long')
    ],validate, categoryController.create
);
categoryRoutes.get('/:id', categoryController.getById);
categoryRoutes.put('/:id', categoryController.update);
categoryRoutes.delete('/:id', categoryController.delete);



module.exports = categoryRoutes;