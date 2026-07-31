import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.routes.js";

dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 5000;

app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

const __dirname = path.resolve();

app.use(express.json());

app.use("/api/products", productRoutes);

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route path not found." });
});
    
app.listen(PORT, async () => {
    await connectDB();
	console.log("Server started at http://localhost: " + PORT);
});