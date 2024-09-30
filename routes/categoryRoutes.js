
const categoryRoutes = require('express').Router();
const Category = require('../models/category');
categoryRoutes.get("/", async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).select('-isActive -__v');
        return res.json(categories);
    } catch (error) {
        console.log("/api/categories error", error);
        return res.status(500).json(error);
    }
});

categoryRoutes.post("/", async (req, res) => {
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
});

categoryRoutes.get("/:id", async (req, res) => {
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
});

categoryRoutes.put("/:id", async (req, res) => {
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
});

categoryRoutes.delete("/:id", async (req, res) => {
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
});

module.exports = categoryRoutes;