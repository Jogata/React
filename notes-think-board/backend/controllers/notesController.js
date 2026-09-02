import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        // res.status(200).json(notes);
        setTimeout(() => {
            res.status(200).json(notes);
		}, 5000);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getNoteById(req, res) {
	// if (!mongoose.Types.ObjectId.isValid(id)) {
	// 	return res.status(404).json({ message: "Invalid Note ID" });
	// }

    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found!" });
        // res.status(200).json(note);
        setTimeout(() => {
            res.status(200).json(note);
		}, 5000);
    } catch (error) {
        console.error("Error in getNoteById controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createNote(req, res) {
    const { title, content } = req.body;
    
    try {
        // const { title, content } = req.body;
        const note = new Note({ title, content });

        const savedNote = await note.save();
        const notetUrl = `/api/note/${savedNote._id}`;

        // res.status(201).location(notetUrl).json(savedNote);
        setTimeout(() => {
			res.status(201).location(notetUrl).json(savedNote);
		}, 5000);
    } catch (error) {
        console.error("Error in createNote controller", error);

        let message = error.message;
		
		if (error.code == 11000) {
			message = `A note with the title '${title}' already exists. Please choose a different title.`;
			console.log(11000, message);
			return res.status(409).json({ message });
		}

        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateNote(req, res) {
	// if (!mongoose.Types.ObjectId.isValid(id)) {
	// 	return res.status(404).json({ message: "Invalid Note ID" });
	// }

    try {
        const { title, content } = req.body;
        const { id } = req.params;

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content },
            {
                returnDocument: "after", 
                runValidators: true
            }
        );

        if (!updatedNote) return res.status(404).json({ message: "Note not found" });

        console.log("updated note: ", updatedNote);

        // res.status(200).json(updatedNote);
        setTimeout(() => {
            res.status(200).json(updatedNote);
		}, 5000);
    } catch (error) {
        console.error("Error in updateNote controller", error);

        if (error.name === "ValidationError") {
			const errorList = Object.keys(error.errors).map((key) => ({
				field: key,
				message: error.errors[key].message
			}));

			return res.status(422).json({
				errors: errorList
			});
		}

		res.status(500).json({
			errors: [
				{
					field: "server",
					message: "An unexpected internal server error occurred"
				}
			]
		});
    }
}

export async function deleteNote(req, res) {
    const { id } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
	// 	return res.status(404).json({ message: "Invalid Note ID" });
	// }

    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        // res.status(200).json({ message: "Note deleted successfully!" });
        setTimeout(() => {
            res.status(200).json({ message: "Note deleted successfully!" });
        }, 5000);
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}