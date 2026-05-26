require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    console.log(username);

    try {
        const user = fakeDB.find(user => user.username === username);

        if (user) throw new Error("User already exist");

        const hashedPassword = await bcrypt.hash(password, 10);

        fakeDB.push({
            id: fakeDB.length,
            username,
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

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const createAccessToken = userId => {
        return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15m",
        });
      };
      
      const createRefreshToken = userId => {
        return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: "7d",
        });
      };
      
      const sendAccessToken = (res, username, accesstoken) => {
        res.send({
          accesstoken,
          username,
        });
      };
      
      const sendRefreshToken = (res, token) => {
        res.cookie("refreshtoken", token, {
          httpOnly: true,
          path: "/refresh-token",
        });
      };

    try {
        const user = fakeDB.find(user => user.username === username);
        if (!user) throw new Error("User does not exist");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Password not correct");

        const accesstoken = createAccessToken(user.id);
        const refreshtoken = createRefreshToken(user.id);

        user.refreshtoken = refreshtoken;

        sendRefreshToken(res, refreshtoken);
        sendAccessToken(res, username, accesstoken);
    } catch (err) {
        res.send({
            error: err.message,
        });
    }
});

app.post("/refresh-token", (req, res) => {
    const token = req.cookies.refreshtoken;

    if (!token) return res.send({ accesstoken: "" });

    let payload = null;

    try {
        payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return res.send({ accesstoken: "" });
    }

    const user = fakeDB.find(user => user.id === payload.userId);
    if (!user) return res.send({ accesstoken: "" });

    if (user.refreshtoken !== token) {
        return res.send({ accesstoken: "" });
    }

    const createAccessToken = userId => {
        return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });
    };

    const createRefreshToken = userId => {
        return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "7d",
        });
    };

    const sendRefreshToken = (res, token) => {
        res.cookie("refreshtoken", token, {
            httpOnly: true,
            path: "/refresh-token",
        });
    };

    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    user.refreshtoken = refreshtoken;

    sendRefreshToken(res, refreshtoken);
    return res.send({ accesstoken });
});

app.post("/protected", async (req, res) => {
    const isAuth = req => {
        const authorization = req.headers["authorization"];
        if (!authorization) throw new Error("You need to login from server.");

        const token = authorization.split(" ")[1];
        const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return userId;
    };

    try {
        const userId = isAuth(req);

        if (userId !== null) {
            res.send({
                data: "This is protected data.",
            });
        }
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

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on("error", err => {
    console.log(err);
})