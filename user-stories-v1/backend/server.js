require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 5000;

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));

// =============================================================
const users = [
  {
    id: "user1",
    username: "user1", 
    password: "1234"
  }
];

app.get("/payment", (req, res) => {
  res.send("it's working");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username == username);

  if (!user) {
    res.status(400).json({message: "Username or password incorrect"});
  }

  if (user.password !== password) {
    res.status(400).json({message: "Username or password incorrect"});
  }

  const token = jwt.sign({
    id, 
    username
  }, 
  "secret");

  res.status(200).json({message: "Welcome back", token});
})
// =============================================================

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