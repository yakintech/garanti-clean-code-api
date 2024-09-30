const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');

const productRoutes = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

productRoutes.post("/", upload.array('images', 10), async (req, res) => { // Allow up to 10 images
    try {
        const imagePaths = req.files.map(file => file.path); // Save image paths to an array

        console.log("imagePaths", imagePaths);

        const product = new Product({
            name: req.body.name,
            categoryId: req.body.categoryId,
            price: req.body.price,
            stock: req.body.stock,
            images: imagePaths // Save image paths to database
        });

        await product.save();
        return res.json(product);
    } catch (error) {
        console.log("/api/products error", error);
        return res.status(500).json(error);
    }
});

module.exports = productRoutes;