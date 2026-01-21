"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const categories_1 = __importDefault(require("./src/routes/categories"));
const products_1 = __importDefault(require("./src/routes/products"));
const cart_1 = __importDefault(require("./src/routes/cart"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const mongoConfig_1 = require("./src/data/mongoConfig");
const swagger_1 = require("./src/config/swagger");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// middleware
app.use(express_1.default.json());
// Swagger documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// routes
app.use("/api/auth", auth_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/products", products_1.default);
app.use("/api/cart/:userId", cart_1.default);
// Connect to MongoDB and start server
async function startServer() {
    try {
        await (0, mongoConfig_1.connectMongo)();
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
startServer();
