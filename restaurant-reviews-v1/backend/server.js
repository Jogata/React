import "dotenv/config";
import express from "express";
import cors from "cors";

import restaurants from "./api/restaurants.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is ready");
})

// app.get("/api/v1/restaurants", (req, res) => {
//     res.send("Hello");
// });

app.use("/api/v1/restaurants", restaurants);

app.use((req, res) => res.status(404).json({ error: "not found"}));

export default app;