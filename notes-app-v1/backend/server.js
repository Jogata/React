import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
	console.log("Server started at http://localhost: " + PORT);
});