import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useNotify } from "../../context/NotificationProvider";
import { notesApi } from "../../services/notes";
import { useNotes } from "../../context/NotesProvider";

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const HomePage = () => {
    // const [loading, setLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const { notes, initializeNotes, updateNote, deleteNote } = useNotes();

    const { addNotification } = useNotify();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [note, setNote] = useState(null);

    const setModalMode = () => console.log("todo setModalMode");

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    if (loading) {
        return <Spinner />;
    }

    if (!notes) {
        return <h1>Data not received</h1>;
    }

    if (notes.length == 0) {
        return <NotesNotFound />;
    }

    async function handleDeleteNote(id) {
        try {
            // const response = 
            await notesApi.deleteNote(id);
            // const response = 
            // await notesApi.deleteNote("nvfdsbhk");

            deleteNote(id);
            // console.log("Note deleted successfully");
            addNotification("Note deleted successfully", "success");
        } catch (error) {
            console.log("Error in handleDelete: ", error.message);
            // console.log("Failed to delete note");
            addNotification("Failed to delete note", "error");
            addNotification(error.message, "error");
        }
    };

    async function handleUpdateNote(updatedNote) {
        if (!updatedNote.title || !updatedNote.content) {
            addNotification("Please fill in all fields.", "error");
            return;
        }

        try {
            const response = await notesApi.updateNote(updatedNote);
            setNote(null);
            updateNote(response);
            addNotification(`Note ${updatedNote.title} updated`);
            closeModal();
        } catch (error) {
            console.log(error);
            // console.log(error.status, error.errors);
            // const keys = Object.keys(error.errors);
            // console.log(keys);
            // keys.forEach(key => {
            //     console.log(key);
            //     addNotification(error.errors[key], "error")
            // });
            // error.errors.forEach(error => {
            addNotification(error.message, "error");
            // })
        }
    }

    return (
        <>
            <Notes 
                notes={notes} 
                handleDeleteNote={handleDeleteNote} 
                openModal={openModal} 
                setNote={setNote} 
            />

            <Modal
                isModalOpen={isModalOpen}
                setModalMode={setModalMode}
                onClose={closeModal}
                title={"Edit Note"}
            >
                {isModalOpen ? 
                    <Form 
                        note={{ ...note }} 
                        handleUpdateNote={handleUpdateNote} 
                    /> 
                    : null
                }
            </Modal>
        </>
    )
};

function Notes({ notes, handleDeleteNote, openModal, setNote }) {
    return (
        <div className="section notes-section">
            <h1 className="section-title">Notes</h1>
            <div className="notes">
                {notes.map(note => (
                    <NoteCard 
                        key={note._id} 
                        note={note} 
                        handleDeleteNote={handleDeleteNote} 
                        openModal={openModal}
                        setNote={setNote}
                    />
                ))}
            </div>
        </div>
    )
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
};

const NotesNotFound = () => {
    return (
        <div className="">
            <div className="">
                <i className="fa fa-notebook"></i>
            </div>
            <h1 className="">No notes yet</h1>
            <p className="">
                Ready to organize your thoughts? Create your
                first note to get started on your journey.
            </p>
            <Link to="/create" className="btn">
                Create Your First Note
            </Link>
        </div>
    );
};

function Modal({ isModalOpen, setModalMode, onClose, title, children }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialogNode = dialogRef.current;
        if (!dialogNode) return;

        if (isModalOpen) {
            dialogNode.showModal();
            setModalMode(true);
        } else {
            dialogNode.close();
            setModalMode(false);
        }

        return () => {
            setModalMode(false);
        };
    }, [isModalOpen]);

    return (
        <dialog
            className="modal"
            ref={dialogRef}
            onClose={onClose}
            onClick={onClose}
        >
            <header>
                <button type="button" className="icon" onClick={onClose}>
                    <span className="sr-only">Close Modal</span>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
                <h2 id="modal-title">{title}</h2>
            </header>

            <div className="modal-body" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </dialog>
    );
}

function Form({ note, handleUpdateNote }) {
    const [updatedNote, setUpdatedNote] = useState(note);
    const [saving, setSaving] = useState(false);

    function handleInputChange(e) {
        setUpdatedNote(old => {
            console.log(e.target.name, e.target.value);
            return {
                ...old,
                [e.target.name]: e.target.value
            }
        })
    }

    async function handleSubmitForm(e) {
        e.preventDefault();

        if (saving) {
            console.log("The note is currently being updated.");
            return;
        }

        try {
            setSaving(true);
            await handleUpdateNote(updatedNote);
        } catch (error) {
            console.log("Note wasn't updated");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="modal-form centered"
            onSubmit={handleSubmitForm}
        >
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input
                    type="text"
                    name="title"
                    className="input input-bordered"
                    value={updatedNote.title}
                    onChange={handleInputChange}
                    placeholder="Note Title"
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Content</span>
                </label>
                <textarea
                    className="textarea textarea-bordered"
                    name="content"
                    value={updatedNote.content}
                    onChange={handleInputChange}
                    placeholder="Write your note here..."
                />
            </div>

            <button
                type="submit"
                className="btn"
            >
                {saving ? "Saving..." : "Edit Note"}
            </button>
        </form>
    )
}

const Spinner = () => {
    return (
        <span
            className="loader"
            role="status"
            aria-live="polite"
        >
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <span className="sr-only">Loading content, please wait.</span>
        </span>
    )
}

export default HomePage;