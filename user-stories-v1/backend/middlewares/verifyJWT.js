const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    // const authHeader = req.headers.authorization || req.headers.Authorization;
    const authHeader = req.headers.authorization;
    // console.log("authHeader=" + authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
        // return res.status(401).json({ message: "Unauthorized" });
        // return res.status(401).json({ message: "Unauthorized / server / verifyJWT.js - 8" });
        return res.status(401).json({
            error: {
                code: "INVALID_AUTH_HEADER",
                type: "screen",
                message: "Unauthorized / server / verifyJWT.js - 15"
                // "message": "The email address format is invalid",
                // "field": "email",
                // "details": "Email must contain @ symbol and valid domain"
            },
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            // if (err) return res.status(403).json({ message: "Forbidden" });
            if (err) return res.status(403).json({
                error: {
                    code: "INVALID_AUTH_HEADER",
                    type: "screen",
                    message: "Forbidden / server / verifyJWT.js - 34"
                    // "message": "The email address format is invalid",
                    // "field": "email",
                    // "details": "Email must contain @ symbol and valid domain"
                },
            });
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    )
}

module.exports = verifyJWT;