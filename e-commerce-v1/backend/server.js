import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectBD } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is ready");
})

app.use("/products", productRoutes);

app.listen(PORT, () => {
    connectBD();
    console.log("Server started");
})