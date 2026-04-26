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
    try {        
        const { username, password, roles } = req.body;
    
        if (!username || !password || !Array.isArray(roles) || !roles.length) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        const duplicate = await User.findOne({ username }).lean().exec();
    
        if (duplicate) {
            return res.status(409).json({ message: "Duplicate username" });
        }
    
        const hashedPwd = await bcrypt.hash(password, 10);
    
        const userObject = { username, "password": hashedPwd, roles };
    
        const user = await User.create(userObject)
    
        if (user) {
            res.status(201).json({ message: `New user ${username} created` });
        } else {
            res.status(400).json({ message: "Invalid user data received" });
        }
    } catch (error) {
        console.log(error);
    }
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