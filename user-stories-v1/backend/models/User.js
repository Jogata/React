const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true, 
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username must be max 20 characters long"],
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        required: true, 
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("User", userSchema);