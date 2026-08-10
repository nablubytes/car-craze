const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify");

// ===============================
// Create Product
// ===============================
exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            brand,
            category,
            subcategory,
            mrp,
            sellingPrice,
            stock,
            warranty,
            featured,
            bestSeller,
            newArrival,
            highlights,
            description,
            image,
            images
        } = req.body;

        // Validation
        if (!name || !category || !subcategory || !mrp || !sellingPrice) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Check Category
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        // Generate Slug
        const slug = slugify(name, {
            lower: true,
            strict: true
        });

        // Duplicate Check
        const existingProduct = await Product.findOne({ slug });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product already exists."
            });
        }

        const product = await Product.create({
            name,
            slug,
            brand,
            category,
            subcategory,
            mrp,
            sellingPrice,
            stock,
            warranty,
            featured,
            bestSeller,
            newArrival,
            highlights,
            description,
            image,
            images
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Get All Products
// ===============================
exports.getProducts = async (req, res) => {

    try {

        const products = await Product.find()
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ===============================
// Get Single Product
// ===============================
exports.getProduct = async (req, res) => {

    try {

        const product = await Product.findOne({
            slug: req.params.slug
        }).populate("category", "name");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ===============================
// Update Product
// ===============================
exports.updateProduct = async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product: updatedProduct
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ===============================
// Delete Product
// ===============================
exports.deleteProduct = async (req, res) => {

    try {

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};