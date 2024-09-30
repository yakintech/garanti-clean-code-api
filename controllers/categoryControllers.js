const Category = require("../models/category");


const categoryController = {
    getAll: async (req, res) => {
        try {
            const categories = await Category.find({ isActive: true });
            return res.json(categories);
        } catch (error) {
            console.log("/api/categories error", error);
            return res.status(500).json(error);
        }
    },
    create: async (req, res) => {
        try {
            const category = new Category({
                name: req.body.name,
                description: req.body.description
            });
            await category.save();
            return res.json(category);
        } catch (error) {
            console.log("/api/categories error", error);
            return res.status(500).json(error);
        }
    },
    getById: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category.isActive) {
                return res.status(404).json({ message: "Category not found or inactive" });
            }
            return res.json(category);
        } catch (error) {
            console.log("/api/categories/:id error", error);
            return res.status(500).json(error);
        }
    },
    update: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category || !category.isActive) {
                return res.status(404).json({ message: "Category not found or inactive" });
            }
            category.name = req.body.name;
            category.description = req.body.description;
            await category.save();
            return res.json(category);
        } catch (error) {
            console.log("/api/categories/:id error", error);
            return res.status(500).json(error);
        }
    },
    delete: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category || !category.isActive) {
                return res.status(404).json({ message: "Category not found or inactive" });
            }
            category.isActive = false;
            await category.save();
            return res.json(category);
        } catch (error) {
            console.log("/api/categories/:id error", error);
            return res.status(500).json(error);
        }
    }
}

module.exports = categoryController;