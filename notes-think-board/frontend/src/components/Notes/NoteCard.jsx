import { useState } from "react";
import { Link } from "react-router";

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const NoteCard = ({ note, handleDeleteNote, openModal, setNote }) => {
    const [deleting, setDeleting] = useState(false);

    const handleClickDeleteNote = async (e) => {
        e.preventDefault();

        if (deleting) {
            console.log("The note is being deleted right now.");
            return;
        }

        // if (!window.confirm("Are you sure you want to delete this note?")) return;
            
        try {
            setDeleting(true);
            const response = await handleDeleteNote(note._id);
        } catch (error) {
            console.log("Error in handleDelete: ", error.message);
            console.log("Failed to delete note");
        } finally {
            setDeleting(false);
        }
    };

    const handleClickUpdateNote = async (e) => {
        e.preventDefault();
        openModal(note);
        setNote(note);
    };

    return (
        <Link to={`/notes/${note._id}`} className="note">
            <div className="card-body">
                <h3 className="card-title">{note.title}</h3>
                <p className="card-text">{note.content}</p>
                <div className="card-footer">
                    <span className="date">
                        {formatDate(new Date(note.createdAt))}
                    </span>
                    <div className="card-actions">
                        <button
                            type="button"
                            className="icon edit-btn"
                            title="Edit"
                            onClick={handleClickUpdateNote}
                        >
                            <span className="sr-only">Edit note {note.title}</span>
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>
                        <button
                            type="button"
                            className="icon delete-btn modal-btn"
                            title="Delete"
                            onClick={handleClickDeleteNote}
                        >
                            {deleting ? (
                                <>
                                    <span className="sr-only">Deleting note {note.title}</span>
                                    <i className="fa fa-spinner" aria-hidden="true"></i>
                                </>
                            ) : (
                                <>
                                    <span className="sr-only">Delete note {note.title}</span>
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default NoteCard;