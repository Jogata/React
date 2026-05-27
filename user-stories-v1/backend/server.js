require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const testwith = (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    const headers = req.headers.test;
    console.log(headers);
    res.send("testwith");
}

const testwithout = (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    // const headers = req.headers.test;
    // console.log(headers);
    res.send("testwithout");
}

const setcoockie = (req, res) => {
    console.log(req.body);
    res.cookie("testhttpOnly", "tokenvaluehttpOnly", {
        httpOnly: true,
        // secure: true,    tofix
        // sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.cookie("test", "tokenvalue", {
        // httpOnly: true,
        // secure: true,    tofix
        // sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.send("Cookie has been set successfully!");
}

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));

app.get("/testwithout", testwithout);
app.get("/testwith", testwith);
app.get("/test", (req, res) => {
    req.body;
});
app.get("/testsetcoockie", setcoockie);

app.use("/*splat", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
})

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on("error", err => {
    console.log(err);
})