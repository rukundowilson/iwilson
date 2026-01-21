import express from "express";
import swaggerUi from "swagger-ui-express";
import categoriesRouter from "./src/routes/categories";
import productsRouter from "./src/routes/products";
import cartRouter from "./src/routes/cart";
import authRouter from "./src/routes/auth";
import { connectMongo } from "./src/data/mongoConfig";
import { swaggerSpec } from "./src/config/swagger";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart/:userId", cartRouter);

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectMongo();
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
