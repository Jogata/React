const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username.length || !password.length) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 3) {
        return res.status(400).json({message: "The username must be atleast 3 characters"});
    }
    
    if (password.length < 6) {
        return res.status(400).json({message: "The password must be atleast 6 characters"});
    }

    const USER_REGEX = /^[A-z0-9]{3,20}$/;
    if (!USER_REGEX.test(username)) {
        return res.status(400).json({message: "The username can contains only letters and numbers"});
    }
    
    const PWD_REGEX = /^[A-z0-9!@#$%]{6,12}$/;
    if (!PWD_REGEX.test(password)) {
        return res.status(400).json({message: "The password can contains only letters, numbers and !@#$%"});
    }

    const foundUser = await User.findOne({ username }).exec();

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log(password, foundUser);

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) return res.status(401).json({ message: "Wrong username or password" });

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        // secure: true,    tofix
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken });
}

const refresh = (req, res) => {
    // console.log("todo refresh");
    // res.send("todo refresh");
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });

            const foundUser = await User.findOne({ username: decoded.username }).exec();

            if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            )

            res.json({ accessToken });
        }
    )
}

const logout = (req, res) => {
    // console.log("todo logout");
    // res.send("todo logout");
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
}

module.exports = {
    login,
    refresh,
    logout
}