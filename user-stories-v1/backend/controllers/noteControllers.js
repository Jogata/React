const Note = require("../models/Note");
const User = require("../models/User");

const getAllNotes = async (req, res) => {
    const notes = await Note.find().lean();

    if (!notes?.length) {
        return res.status(204).json({ message: "No notes found", data: []});
    }

    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        return { ...note, username: user.username };
    }))

    res.json({ message: "", data: notesWithUser});
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