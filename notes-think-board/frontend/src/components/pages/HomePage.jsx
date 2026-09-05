import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const HomePage = () => {
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(true);
    // const abortControllerRef = useRef(null);
    
    useEffect(() => {
        let controller = new AbortController();
        // abortControllerRef.current = controller;
        // abortControllerRef.current = new AbortController();
        loadNotes();
        
        async function loadNotes() {
            setLoading(true);
            try {
                const notes = await getAllNotes();
                setNotes(notes);
                // setError(null);
                // abortControllerRef.current = null;
                controller = null;
            } catch (error) {
                // setError(err.message);
                if (error.name === "AbortError") {
                    console.log("Fetch safely aborted by layout unmount");
                    return;
                }
                
                // abortControllerRef.current = null;
                controller = null;
                console.log("Error fetching notes");
                console.log(error.message);
                console.log("Failed to load notes");
            } finally {
                // if (!abortControllerRef.current) {
                //     setLoading(false);
                // }
                if (!controller) {
                    setLoading(false);
                }
            }
        }

        async function getAllNotes() {
            const response = await fetch("http://localhost:5000/api/notes", {
                // signal: abortControllerRef.current.signal
                signal: controller.signal
            });

            const contentType = response.headers.get("content-type");
            let result = null;

            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                result = await response.text();
            }

            if (response.ok) {
                return result;
            } else {
                const errorMessage = result.message || "An error occurred";                
                throw new Error(errorMessage);
            }
        };

        return () => {
            // console.log("clean up");
            // if (abortControllerRef.current) {
            //     abortControllerRef.current.abort();
            // }
            if (controller) {
                controller.abort();
            }
        }
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (!notes) {
        return <h1>Data not received</h1>;
    }

    if (notes.length == 0) {
        return <NotesNotFound />;
    }

    async function deleteNote(id) {
        const response = await fetch(
            `http://localhost:5000/api/notes/${id}`, {
                method: "DELETE"
            });

        const contentType = response.headers.get("content-type");
        let result = null;

        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        if (response.ok) {
            return result;
        } else {
            const errorMessage = result.message || "An error occurred";
            throw new Error(errorMessage);
        }
    }

    async function handleDeleteNote(id) {
        try {
            const response = await deleteNote(id);
            // const response = await deleteNote("nvfdsbhk");

            setNotes(currentNotes => currentNotes.filter(note => note._id !== id));
            console.log("Note deleted successfully");
        } catch (error) {
            console.log("Error in handleDelete: ", error.message);
            console.log("Failed to delete note");
            throw new Error(error.message);
        }
    };

    return <Notes notes={notes} handleDeleteNote={handleDeleteNote} />
};

function Notes({ notes, handleDeleteNote }) {
    return (
        <div className="section notes-section">
            <h1 className="section-title">Notes</h1>
            <div className="notes">
                {notes.map(note => (
                    <NoteCard 
                        key={note._id} 
                        note={note} 
                        handleDeleteNote={handleDeleteNote} 
                    />
                ))}
            </div>
        </div>
    )
}

const NoteCard = ({ note, handleDeleteNote }) => {
    const handleClickDeleteNote = async (e) => {
        e.preventDefault();

        // if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            const response = await handleDeleteNote(note._id);
        } catch (error) {
            console.log("Error in handleDelete: ", error.message);
            console.log("Failed to delete note");
        }
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
                            // onClick={openModal}
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
                            <span className="sr-only">Delete note {note.title}</span>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
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