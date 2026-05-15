const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true, 
        minlength: [3, "Username must be at least 3 characters long"],
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        required: true, 
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    roles: [{
        type: String,
        // enum: ["Employee", "Admin", ""],
        // default: ["Employee"]
        default: "Employee"
    }],
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("User", userSchema);