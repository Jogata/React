import express from "express";
import dotenv from "dotenv";
import { connectBD } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is ready");
})

app.use("/products", productRoutes);

app.listen(5000, () => {
    connectBD();
    console.log("Server started");
})