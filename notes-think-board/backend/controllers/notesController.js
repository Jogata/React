import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found!" });
        res.json(note);
    } catch (error) {
        console.error("Error in getNoteById controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createNote(req, res) {
    try {
        const { title, content } = req.body;
        const note = new Note({ title, content });

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateNote(req, res) {
    try {
        const { title, content } = req.body;
        const { id } = req.params;

        const updatedNote = await Note.findByIdAndUpdate(
            // req.params.id,
            id,
            { title, content },
            {
                // new: true,
                returnDocument: "after", 
                runValidators: true
            }
        );

        if (!updatedNote) return res.status(404).json({ message: "Note not found" });

        console.log(updatedNote);

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNote controller", error);

        if (error.name === "ValidationError") {
			const errorList = Object.keys(error.errors).map((key) => ({
				field: key,
				message: error.errors[key].message
			}));

			return res.status(422).json({
				// success: false,
				errors: errorList
			});
		}

		res.status(500).json({
			// success: false,
			errors: [
				{
					field: "server",
					message: "An unexpected internal server error occurred"
				}
			]
		});

        // res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteNote(req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ message: "Note deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}