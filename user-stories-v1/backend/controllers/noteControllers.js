const Note = require("../models/Note");
const User = require("../models/User");

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().lean();

        if (!notes?.length) {
            // setTimeout(() => {
            //     res.status(200).json({ message: "No notes found", data: []});
            // }, 5000);
            // return;
            return res.status(200).json({ message: "No notes found", data: []});
        }
    
        const notesWithUser = await Promise.all(notes.map(async (note) => {
            const user = await User.findById(note.user).lean().exec();
            return { ...note, username: user.username };
        }))
    
        // setTimeout(() => {
        //     res.json({ message: "", data: notesWithUser});
        // }, 5000);
    
        res.json({ message: "", data: notesWithUser});    
    } catch (error) {
        console.log(error.message);
    }
}

const createNewNote = async (req, res) => {
    // console.log("todo createNewNote");
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
    console.log("todo updateNote");
}

const deleteNote = async (req, res) => {
    // console.log("todo deleteNote");
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Note ID required" });
    }
    
    const note = await Note.findById(id).exec();
    
    if (!note) {
        return res.status(400).json({ message: "Note not found" });
    }
    
    const result = await note.deleteOne();
    
    const reply = `Note "${result.title}" with ID ${result._id} deleted`;
    
    res.json(reply);
}

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}