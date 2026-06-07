require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

const db = {
  users: [
    {
      username: "harblaith@harb.com",
      password: "asdasdas"
    }
  ],
  publicPosts: [
    {
      title: "Free Tips on Development",
      content: "These are some tips"
    }
  ],
  privatePosts: [
    {
      title: "Paid Tips on Development",
      content: "These are some tips"
    }
  ]
}

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(422).json({ message: "All fields are required" });
    }

    if (!username.length || !password.length) {
      return res.status(422).json({ message: "All fields are required" });
    }
    
    if (username.length < 3) {
        return res.status(422).json({message: "The username must be atleast 3 characters"});
    }
    
    if (password.length < 6) {
        return res.status(422).json({message: "The password must be atleast 6 characters"});
    }
  
    const USER_REGEX = /^[A-z0-9]{3,20}$/;
    if (!USER_REGEX.test(username)) {
        return res.status(422).json({message: "The username can contains only letters and numbers"});
    }
    
    const PWD_REGEX = /^[A-z0-9!@#$%]{6,12}$/;
    if (!PWD_REGEX.test(password)) {
        return res.status(422).json({message: "The password can contains only letters, numbers and !@#$%"});
    }

    let user = db.users.find((user) => {
        return user.username === username;
    });

    if(user) {
        return res.status(409).json({
            // errors: [
                // {
                    message: "This user already exists",
                // }
            // ]
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.users.push({
        username,
        password: hashedPassword
    });

    const token = jwt.sign({ username }, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000});

    res.json({ token });
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let user = db.users.find((user) => {
      return user.username === username;
  });

  if(!user){
      return res.status(422).json({
          errors: [
              {
                  msg: "Invalid Credentials",
              }
          ]
      })
  }

  let isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
      return res.status(404).json({
          errors: [
              {
                  msg: "Invalid Credentials" 
              }
          ]
      })
  }

  const token = jwt.sign({username}, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000});

  res.json({
      token
  })
})

app.get("/public", (req, res) => {
  res.json(db.publicPosts);
})

const checkAuth = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if(!token){
      res.status(401).json({
          errors: [
              {
                  msg: "No token found"
              }
          ]
      })
  }

  try {
      const user = jwt.verify(token, "nfb32iur32ibfqfvi3vf932bg932g932");
      req.user = user.username;

      next();
  } catch (error) {
      res.status(403).json({
          errors: [
              {
                  msg: "Invalid Token"
              }
          ]
      })
  }
}

app.get("/private", checkAuth, (req, res) => {
  console.log(req.user);
  res.json(db.privatePosts);
})

app.get("/all", (req, res) => {
  res.json(db.users);
})

// =============================================================
app.get("/me", (req, res) => {
  res.json("ok");
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