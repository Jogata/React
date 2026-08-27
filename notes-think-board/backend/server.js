import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import mongoose from "mongoose";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: "http://localhost:5173",
        })
    );
}

app.use(express.json());

// app.use((req, res, next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// });

app.get("/test-get", (req, res) => {
    const jsonresponse = {
        message: "Server is ready",
        method: req.method,
        url: req.url
    };
    res.json(jsonresponse);
})

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MONGODB CONNECTED SUCCESSFULLY!");
//   } catch (error) {
//     console.error("Error connecting to MONGODB", error);
//     process.exit(1);
//   }
// };

// connectDB();

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
});