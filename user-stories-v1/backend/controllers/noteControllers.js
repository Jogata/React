const mongoose = require("mongoose");
const Note = require("../models/Note");
const User = require("../models/User");

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().lean();

        if (!notes?.length) {
            return res.status(200).json({ message: "No notes found", data: []});
        }
    
        const notesWithUser = await Promise.all(notes.map(async (note) => {
            const user = await User.findById(note.user).lean().exec();
            return { ...note, username: user.username };
        }))
    
        res.json({ data: notesWithUser });
    } catch (error) {
        console.log(error.message);
    }
}

const createNewNote = async (req, res) => {
    const { user, title, text } = req.body;

    if (!user || !title || !text) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    const duplicate = await Note.findOne({ title }).lean().exec();
    
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate note title" });
    }
    
    const note = await Note.create({ user, title, text });
    
    if (note) {
        return res.status(201).json({ message: "New note created" });
    } else {
        return res.status(400).json({ message: "Invalid note data received" });
    }    
}

const updateNote = async (req, res) => {
    // console.log("todo updateNote");
    const { id, user, title, text, completed } = req.body;

    if (!id || !user || !title || !text || typeof completed !== "boolean") {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    
    const note = await Note.findById(id).exec();
    // console.log(note);
    
    if (!note) {
        return res.status(400).json({ message: "Note not found" });
    }
    
    const duplicate = await Note.findOne({ title }).lean().exec();
    
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate note title" });
    }
    
    // console.log(user);
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;
    
    const updatedNote = await note.save();
    
    res.json({message: `"${updatedNote.title}" updated`});    
}

const deleteNote = async (req, res) => {
    // console.log("todo deleteNote");
    const { id } = req.body;
    console.log(id);

    if (!id) {
        return res.status(400).json({ message: "Note ID required" });
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    
    const note = await Note.findById(id).exec();
    
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    
    const result = await Note.findByIdAndDelete(id);
    // console.log(result);
    
    const message = `Note "${result.title}" with ID ${result._id} deleted`;
    
    res.status(200).json({message});
}

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}