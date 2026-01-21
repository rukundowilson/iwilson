import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { getProducts, addProduct, getCategories } from "../data/store";
import { Product } from "../types";
import { connectMongo } from "../data/mongoConfig";

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await getProducts();
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const products = await getProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description, categoryId, inStock, quantity } = req.body as Partial<Product>;
  if (!name || price === undefined || !categoryId || inStock === undefined || quantity === undefined) {
    return res.status(400).json({ message: "Missing required product fields" });
  }
  const categories = await getCategories();
  const catExists = categories.some((c) => c.id === categoryId);
  if (!catExists) return res.status(400).json({ message: "categoryId does not exist" });
  const newP: Product = { id: uuid(), name, price, description, categoryId, inStock, quantity } as Product;
  await addProduct(newP);
  res.status(201).json(newP);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, description, categoryId, inStock, quantity } = req.body as Partial<Product>;
  const db = await connectMongo();
  const col = db.collection<Product>("products");
  const product = await col.findOne({ id });
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (categoryId !== undefined) {
    const categories = await getCategories();
    const catExists = categories.some((c) => c.id === categoryId);
    if (!catExists) return res.status(400).json({ message: "categoryId does not exist" });
    product.categoryId = categoryId;
  }
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  product.description = description;
  if (inStock !== undefined) product.inStock = inStock;
  if (quantity !== undefined) product.quantity = quantity;
  await col.updateOne({ id }, { $set: product });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = await connectMongo();
  const col = db.collection<Product>("products");
  const result = await col.deleteOne({ id });
  if (result.deletedCount === 0) return res.status(404).json({ message: "Product not found" });
  res.status(204).send();
};
