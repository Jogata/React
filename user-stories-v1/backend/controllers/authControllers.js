const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    console.log("todo login");
    res.send("todo login");
}

const refresh = (req, res) => {
    console.log("todo refresh");
    res.send("todo refresh");
}

const logout = (req, res) => {
    console.log("todo logout");
    res.send("todo logout");
}

module.exports = {
    login,
    refresh,
    logout
}