require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 5000;

// console.log(process.env.TEST);

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

// app.use("/", require("./routes/root"));
// app.use("/auth", require("./routes/authRoutes"));
// app.use("/users", require("./routes/userRoutes"));
// app.use("/notes", require("./routes/noteRoutes"));

const fakeDB = [];

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = fakeDB.find(user => user.username === username);
      
      if (user) throw new Error("User already exist");

      const hashedPassword = await bcrypt.hash(password, 10);

      fakeDB.push({
        id: fakeDB.length,
        email,
        password: hashedPassword,
      });
      res.send({ message: "User Created" });
      console.log(fakeDB);
    } catch (err) {
      res.send({
        error: err.message,
      });
    }
  });

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

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on("error", err => {
    console.log(err);
})