const Note = require("../models/Note");
const User = require("../models/User");

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().lean();

        if (!notes?.length) {
            setTimeout(() => {
                res.status(200).json({ message: "No notes found", data: []});
            }, 5000);
            return;
            // return res.status(200).json({ message: "No notes found", data: []});
        }
    
        const notesWithUser = await Promise.all(notes.map(async (note) => {
            const user = await User.findById(note.user).lean().exec();
            return { ...note, username: user.username };
        }))
    
        setTimeout(() => {
            res.json({ message: "", data: notesWithUser});
        }, 5000);
    
        // res.json({ message: "", data: notesWithUser});    
    } catch (error) {
        console.log(error.message);
    }
}

const createNewNote = async (req, res) => {
    console.log("todo createNewNote");
}

const updateNote = async (req, res) => {
    console.log("todo updateNote");
}

const deleteNote = async (req, res) => {
    console.log("todo deleteNote");
}

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}