"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const uuid_1 = require("uuid");
const store_1 = require("../data/store");
const mongoConfig_1 = require("../data/mongoConfig");
const getAllProducts = async (req, res) => {
    const products = await (0, store_1.getProducts)();
    res.json(products);
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    const { id } = req.params;
    const products = await (0, store_1.getProducts)();
    const p = products.find((x) => x.id === id);
    if (!p)
        return res.status(404).json({ message: "Product not found" });
    res.json(p);
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    const { name, price, description, categoryId, inStock, quantity } = req.body;
    if (!name || price === undefined || !categoryId || inStock === undefined || quantity === undefined) {
        return res.status(400).json({ message: "Missing required product fields" });
    }
    const categories = await (0, store_1.getCategories)();
    const catExists = categories.some((c) => c.id === categoryId);
    if (!catExists)
        return res.status(400).json({ message: "categoryId does not exist" });
    const newP = { id: (0, uuid_1.v4)(), name, price, description, categoryId, inStock, quantity };
    await (0, store_1.addProduct)(newP);
    res.status(201).json(newP);
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, categoryId, inStock, quantity } = req.body;
    const db = await (0, mongoConfig_1.connectMongo)();
    const col = db.collection("products");
    const product = await col.findOne({ id });
    if (!product)
        return res.status(404).json({ message: "Product not found" });
    if (categoryId !== undefined) {
        const categories = await (0, store_1.getCategories)();
        const catExists = categories.some((c) => c.id === categoryId);
        if (!catExists)
            return res.status(400).json({ message: "categoryId does not exist" });
        product.categoryId = categoryId;
    }
    if (name !== undefined)
        product.name = name;
    if (price !== undefined)
        product.price = price;
    product.description = description;
    if (inStock !== undefined)
        product.inStock = inStock;
    if (quantity !== undefined)
        product.quantity = quantity;
    await col.updateOne({ id }, { $set: product });
    res.json(product);
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const db = await (0, mongoConfig_1.connectMongo)();
    const col = db.collection("products");
    const result = await col.deleteOne({ id });
    if (result.deletedCount === 0)
        return res.status(404).json({ message: "Product not found" });
    res.status(204).send();
};
exports.deleteProduct = deleteProduct;
