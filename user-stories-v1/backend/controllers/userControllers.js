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
    try {
        const { id, username, roles, active, password } = req.body;

        if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
            return res.status(400).json({ message: "All fields except password are required" });
        }
    
        const user = await User.findById(id).exec();
    
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
    
        const duplicate = await User.findOne({ username }).lean().exec();
    
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: "Duplicate username" });
        }
    
        user.username = username;
        user.roles = roles;
        user.active = active;
    
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
    
        const updatedUser = await user.save();
    
        res.json({ message: `${updatedUser.username} updated` });    
    } catch (error) {
        console.log(error);
    }
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