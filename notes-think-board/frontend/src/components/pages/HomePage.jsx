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
    const abortControllerRef = useRef(null);

    useEffect(() => {
        // 1. Create the abort controller FIRST before doing anything else
        const controller = new AbortController();
        abortControllerRef.current = controller;
    
        // 2. Define your helper functions
        async function getAllNotes() {
            const response = await fetch("http://localhost:5000/api/notes", {
                signal: controller.signal // Use the local controller instance
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
    
        async function loadNotes() {
            setLoading(true); // Trigger the loading spinner state cleanly
            try {
                const notes = await getAllNotes();
                setNotes(notes);
            } catch (error) {
                // 3. Ignore standard abort errors so they don't break your logs
                if (error.name === 'AbortError') {
                    console.log("Fetch safely aborted by layout unmount");
                    return; 
                }
                console.log("Error fetching notes:", error.message);
            } finally {
                setLoading(false); // Turn off the spinner
            }
        }
    
        // 4. FINALLY, execute the function execution after everything is safely defined
        loadNotes();
    
        // 5. Clean up perfectly if the user navigates away mid-stream
        return () => {
            controller.abort();
        };
    }, []);
    

    return (
        <>
            {loading && <Spinner />}

            {notes && notes.length === 0 && <NotesNotFound />}

            {notes && notes.length > 0 && (
                <div className="section notes-section">
                    <h1 className="section-title">Notes</h1>
                    <div className="notes">
                        {notes.map(note => (
                            <NoteCard key={note._id} note={note} setNotes={setNotes} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

const NoteCard = ({ note, setNotes }) => {
    const handleDeleteNote = async (e, id) => {
        e.preventDefault();

        // if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/notes/${id}`, {
                    method: "DELETE"
                });
            // const response = await fetch(`http://localhost:5000/api/notes/fakeid`, {method: "DELETE"});

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            setNotes(currentNotes => currentNotes.filter(note => note._id !== id));
            console.log("Note deleted successfully");
        } catch (error) {
            console.log("Error in handleDelete", error.message);
            console.log("Failed to delete note");
        }
    };

    return (
        <Link to={`/notes/${note._id}`} className="note">
            <div className="card-body">
                <h3 className="card-title">{note.title}</h3>
                <p className="card-text">{note.text}</p>
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
                            onClick={(e) => handleDeleteNote(e, note._id)}
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
            <h3 className="">No notes yet</h3>
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