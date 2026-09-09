import { useCallback, useEffect, useRef, useState } from "react";
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
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        let controller = new AbortController();
        loadNotes();
        
        async function loadNotes() {
            setLoading(true);
            try {
                const notes = await getAllNotes();
                setNotes(notes);
                // setError(null);
                controller = null;
            } catch (error) {
                // setError(err.message);
                if (error.name === "AbortError") {
                    console.log("Fetch safely aborted by layout unmount");
                    return;
                }
                
                controller = null;
                console.log("Error fetching notes");
                console.log(error.message);
                console.log("Failed to load notes");
            } finally {
                if (controller === null) {
                    setLoading(false);
                }
            }
        }

        async function getAllNotes() {
            const response = await fetch("http://localhost:5000/api/notes", {
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
            if (controller) {
                controller.abort();
            }
        }
    }, []);

    const addNotification = useCallback((message, type = "success") => {
        const newToast = { id: crypto.randomUUID(), message, type };
        setNotifications(old => [...old, newToast]);
    }, []);
    
    const removeNotification = useCallback((id) => {
        setNotifications(old => old.filter(toast => toast.id !== id));
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
            // console.log("Note deleted successfully");
            addNotification("Note deleted successfully", "success");
        } catch (error) {
            console.log("Error in handleDelete: ", error.message);
            // console.log("Failed to delete note");
            addNotification("Failed to delete note", "error");
            addNotification(error.message, "error");
            // throw new Error(error.message);
        }
    };

    return (
        <>
            <Notifications notifications={notifications} removeNotification={removeNotification} />
            <Notes notes={notes} handleDeleteNote={handleDeleteNote} />
        </>
    )
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
                            {/* <i className="fa fa-spinner" aria-hidden="true"></i> */}
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

function Notifications({ notifications, removeNotification }) {
    const popoverRef = useRef(null);

    useEffect(() => {
        const popoverNode = popoverRef.current;
        if (!popoverNode) return;

        if (notifications.length > 0) {
            popoverNode.showPopover();
        } else {
            popoverNode.hidePopover();
        }
    }, [notifications.length]);

    return (
        <div
            className="toast-container"
            ref={popoverRef}
            popover="manual"
            role="status"
        >
            {notifications.map(toast => (
                <Notification
                    key={toast.id}
                    toast={toast}
                    onDismiss={removeNotification}
                />
            ))}
        </div>
    );
}

function Notification({ toast, onDismiss }) {
    const [fadeout, setFadeout] = useState(false)
    const id = toast.id;
    console.log(toast);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeout(true);
        }, 6000);

        return () => clearTimeout(timer);
    }, [onDismiss, id]);

    // const accessibilityRole = toast.type === "error" ? "alert" : "status";
    const notificationClassName = fadeout ? (
        `toast-box ${toast.type} fade-out`
    ) : (
        `toast-box ${toast.type}`
    );

    return (
        // <div className={`toast-box ${toast.type}`} role={accessibilityRole}>
        <div className={notificationClassName} onAnimationEnd={() => onDismiss(id)}>
            <p>{toast.message}</p>
            <button
                type="button"
                onClick={() => onDismiss(id)}
                aria-label="Dismiss alert"
            >
                <span>X</span>
            </button>
        </div>
    );
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