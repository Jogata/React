const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    const users = await User.find().select("-password").lean();

    if (!users?.length) {
        return res.status(400).json({ message: "No users found" });
    }

    res.json(users);
}

const createNewUser = async (req, res) => {
    console.log("todo create");
}

const updateUser = async (req, res) => {
    console.log("todo update");
}

const deleteUser = async (req, res) => {
    console.log("todo delete");
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}