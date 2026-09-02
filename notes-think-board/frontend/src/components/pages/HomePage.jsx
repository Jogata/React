import { useEffect, useState } from "react";
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

    useEffect(() => {
        async function fetchNotes() {
            // console.log("fetch started");
            try {
                const response = await fetch("http://localhost:5000/api/notes");
                console.log(response);
                const data = await response.json();
                console.log(data);
                setNotes(data);
            } catch (error) {
                console.log("Error fetching notes");
                console.log(error.response);
                console.log("Failed to load notes");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div className="">
            <div className="">
                {loading && <Spinner />}

                {notes && notes.length === 0 && <NotesNotFound />}

                {notes && notes.length > 0 && (
                    <div className="">
                        {notes.map(note => (
                            // <h2 key={note._id}>{note.title}</h2>
                            <NoteCard key={note._id} note={note} setNotes={setNotes} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const NoteCard = ({ note, setNotes }) => {
    const handleDeleteNote = async (e, id) => {
        e.preventDefault();

        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/notes/${id}`, {method: "DELETE"});
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
        <Link to={`/notes/${note._id}`}>
            <div className="card-body">
                <h3 className="card-title">{note.title}</h3>
                <p className="card-content">{note.content}</p>
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