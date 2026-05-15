const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);
// npm install --save mongoose-sequence

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            // type: mongoose.SchemaTypes.ObjectId,
            required: [true, "User is required"],
            // required: true,
            ref: "User"
        },
        title: { 
            type: String,
            minlength: [3, "Note title must be at least 3 characters long"],
            required: [true, "Note title is required"]    
            // required: true
        },
        text: {
            type: String,
            minlength: [3, "Text must be at least 3 characters long"],
            required: [true, "Text is required"] 
            // required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

// noteSchema.plugin(AutoIncrement, {
//     inc_field: "ticket",
//     id: "ticketNums",
//     start_seq: 500
// })

module.exports = mongoose.model("Note", noteSchema);