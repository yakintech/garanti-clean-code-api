const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const { body, validationResult } = require('express-validator');

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

productRoutes.post(
    "/",
    upload.array('images', 10),
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('categoryId').notEmpty().withMessage('Category ID is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        body('stock').isInt({ gt: 0 }).withMessage('Stock must be a positive integer')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Image extension control (just jpeg, jpg, png)
            const allowedExtensions = /jpeg|jpg|png/;
            const files = req.files;
            for (let i = 0; i < files.length; i++) {
                const extension = allowedExtensions.test(path.extname(files[i].originalname).toLowerCase());
                if (!extension) {
                    return res.status(400).json({ message: "Only jpeg, jpg, png files are allowed" });
                }
            }
            const imagePaths = req.files.map(file => file.path);

            const product = new Product({
                name: req.body.name,
                categoryId: req.body.categoryId,
                price: req.body.price,
                stock: req.body.stock,
                images: imagePaths // Save image paths to database
            });

            await product.save();
            // Loglama işlemi yapılacak
            return res.status(201).json({ id: product._id });
        } catch (error) {
            console.log("/api/products error", error);
            return res.status(500).json(error);
        }
    }
);

productRoutes.get("/", async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).select('-__v');
        return res.json(products);
    } catch (error) {
        console.log("/api/products GET error", error);
        return res.status(500).json(error);
    }
}
);

productRoutes.get("/:id", async (req, res) => {

    const { id } = req.params;

    //bu id bir objectId mi kontrolü yapılmalı
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const product = await Product.findOne({ _id: req.params.id, isActive: true }).select('-__v');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json(product);
    } catch (error) {
        console.log("/api/products/:id GET error", error);
        return res.status(500).json(error);
    }
});

productRoutes.delete("/:id", async (req, res) => {
    const { id } = req.params;

    //bu id bir objectId mi kontrolü yapılmalı
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            { isActive: false },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product deleted" });
    } catch (error) {
        console.log("/api/products/:id DELETE error", error);
        return res.status(500).json(error);
    }
});

module.exports = productRoutes;

// Code Review Notları product post endpoint

//201 created status code eklendi
//extension kontrolü eklendi
//loglama işlemi yapılacak
//response olarak komple product yerine sadece id dönüldü
//not: id ve url olarak header dönülebilir. Bu sayede client tarafında id bilgisi alınabilir ve url oluşturulabilir. Bu sayede client tarafında tekrar bir get request yapılmasına gerek kalmaz.
// validation işlemleri için express-validator kullanıldı. 
//gerekli dataların trim ve lowerCase edilmesi.
//uploads klasörü altında producta özel bir klasör olmalı
//not: Resimleri direkt projeye kaydetmek yerine bir storage servis kullanılması ( AWS, Azure Blob, Firebase Storage, Digital Ocean Spaces, Google Cloud Storage, vs.) veya imkanımız varsa ve projemize uygunsa resimlerin binary olarak veritabanına kaydedilmesi
//resim boyutu kontrolü yapılmalı. ojinal ve thumbnail olarak 2 kayıt yapılmalı
// JWT ile yetkilendirme yapılmalı
//db ye kaydederken "uploads/" yazmaya gerek yok. Direkt image name kaydedilebilir.