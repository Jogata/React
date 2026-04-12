import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();

app.use(express.json());

// app.get("/", (request, response) => {
//     console.log(request);
//     return response.status(234).send("Welcome");
// });

app.use("/books", bookRoutes);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });