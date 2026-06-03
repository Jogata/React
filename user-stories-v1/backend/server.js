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
const users = [
  {
    id: "user1",
    username: "user1", 
    password: "1234"
  }
];

app.get("/api/v1/protected", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "Forbidden 45" });
  }

  jwt.verify(
    token,
    "secret",
    async (err, decoded) => {
      if (err) {
        res.cookie("token", "", {
          httpOnly: true,
          maxAge: 0
        })

        return res.status(403).json({ message: "Forbidden 53" });
      }
      res.json({ message: "check succesful" });
    }
  )
})

app.get("/api/v1/payment", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "Forbidden 68" });
  }

  jwt.verify(
    token,
    "secret",
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden 76" });
      }
      res.json({ message: "payment succesful" });
    }
  )
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body; 
  
  console.log(username, password); 
 
  if (!username) { 
    return res.status(400).json({message: "Username missing"}); 
  } 
  
  if (!password) { 
    return res.status(400).json({message: "Password missing"}); 
  } 
 
  const user = users.find(user => user.username == username); 
 
  if (!user) { 
    return res.status(400).json({message: "Username or password incorrect"}); 
  } 
   
  if (user.password !== password) { 
    return res.status(400).json({message: "Username or password incorrect"}); 
  } 
 
  if (!user) { 
    return res.status(400).json({ error: "User Doesn't Exist" }); 
  } 
 
  const dbPassword = user.password;

  bcrypt.compare(password, dbPassword)
    .then(match => {
      if (!match) {
        res
          .status(400)
          .json({ error: "Wrong Username and Password Combination!" });
      } else {
        function createTokens(user) {
            const token = jwt.sign({
              id: user.id, 
              username: user.username
            }, 
            "jwtsecretplschange");
            return token;
        }

        const accessToken = createTokens(user);

        res.cookie("access-token", accessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30 * 1000,
        });

        res.json("LOGGED IN");
      }
    });
});

// app.post("/api/v1/login", async (req, res) => {
//   const { username, password } = req.body;
//   console.log(username, password);

//   if (!username) {
//     return res.status(400).json({message: "Username missing"});
//   }

//   if (!password) {
//     return res.status(400).json({message: "Password missing"});
//   }

//   const user = users.find(user => user.username == username);

//   if (!user) {
//     return res.status(400).json({message: "Username or password incorrect"});
//   }
  
//   if (user.password !== password) {
//     return res.status(400).json({message: "Username or password incorrect"});
//   }
  
//   const token = jwt.sign({
//     id: user.id, 
//     username
//   }, 
//   "secret");

//   res.cookie("token", token, {
//     httpOnly: true,
//     maxAge: 7 * 24 * 60 * 60 * 1000
//   })
  
//   res.status(200).json({message: "Welcome back", token});
// })

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      users.push({
        username: username,
        password: hash,
      })
        .then(() => {
          res.json("USER REGISTERED");
        })
        .catch((err) => {
          if (err) {
            res.status(400).json({ error: err });
          }
        });
    });
});

// app.post("/api/v1/register", async (req, res) => {
//   const { username, password } = req.body;
//   console.log(username);

//   if (!username) {
//     return res.status(400).json({message: "Missing username"});
//   }
  
//   if (!password) {
//     return res.status(400).json({message: "Missing password"});
//   }

//   const user = users.find(user => user.username == username);

//   if (user && user.username == username) {
//     return res.status(400).json({message: "Username exist"});
//   }

//   const newUser = {
//     id: username, 
//     username, 
//     password,
//   }

//   users.push(newUser);

//   res.status(200).json({message: "Welcome"});
// })

app.get("/api/v1/logout", (req, res) => {
  const cookies = req.cookies;

  if (cookies) {
    const token = cookies.token;

    if (!token) {
      return res.status(200).json({ message: "You are not loged in" });
    }

    jwt.verify(
      token,
      "secret",
      async (err, decoded) => {
        if (err) {
          const newError = {
            message: "You are not loged in", 
            type: err.name, 
            server: err.message
          }
          return res.status(200).json(newError);
        }
        
        res.cookie("token", "", {
          httpOnly: true,
          maxAge: 0
        })

        res.status(200).json({ message: "logout success from server" });
      }
    )  
  }
  res.send("logout succesful");
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