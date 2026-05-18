const User = require("../models/User");
const Note = require("../models/Note");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").lean();

        // throw new Error("test");
    
        if (!users?.length) {
            return res.status(200).json({ message: "No users found", data: [] });
        }
    
        res.json({data: users});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server error"});
    }
}

const createNewUser = async (req, res) => {
    const { username, password, roles } = req.body;
    
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    if (username.length < 3) {
        return res.status(400).json({message: "The username must be atleast 3 characters"});
    }
    
    if (password.length < 6) {
        return res.status(400).json({message: "The password must be atleast 6 characters"});
    }
    
    try {
        const duplicate = await User.findOne({ username }).lean().exec();
        
        if (duplicate) {
            return res.status(409).json({ message: "Duplicate username" });
        }
    
        const hashedPwd = await bcrypt.hash(password, 10);
    
        const userObject = { username, "password": hashedPwd, roles };
    
        const user = await User.create(userObject);
    
        if (user) {
            res.status(201).json({ message: `New user ${username} created` });
        } else {
            res.status(400).json({ message: "Invalid user data received" });
        }
    } catch (error) {
        if (error.name == "ValidationError") {
            res.status(400).json({message: error.message});
        } else {
            console.log(error.message);
            res.status(500).json({message: "Server error"});
        }
    }
}

const updateUser = async (req, res) => {
    const { id, username, roles, active, password } = req.body;
    
    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    
    if (!username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
        return res.status(400).json({ message: "All fields except password are required" });
    }
    
    if (username.length < 3) {
        return res.status(400).json({message: "The username must be atleast 3 characters"});
    }
    
    if (password.length < 6) {
        return res.status(400).json({message: "The password must be atleast 6 characters"});
    }
    
    try {
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
        if (error.name == "ValidationError") {
            res.status(400).json({message: error.message});
        } else {
            console.log(error.message);
            res.status(500).json({message: "Server error"});
        }
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.body;
    
    if (!id) {
        return res.status(400).json({ message: "User ID Required" });
    }
    
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findById(id).exec();
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    try {
        const note = await Note.findOne({ user: id }).lean().exec();
    
        if (note) {
            return res.status(400).json({ message: "User has assigned notes" });
        }
    
        const result = await User.findByIdAndDelete(id);
    
        const message = `Username ${result.username} with ID ${result._id} deleted`;
    
        res.status(200).json({message});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server error"});
    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}