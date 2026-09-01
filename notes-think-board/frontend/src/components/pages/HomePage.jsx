import { useEffect, useState } from "react";
import { Link } from "react-router";

const HomePage = () => {
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotes() {
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
                {/* {loading && <h1>Loading notes...</h1>} */}
                {loading && <Spinner />}

                {notes && notes.length === 0 && <NotesNotFound />}

                {notes && notes.length > 0 && (
                    <div className="">
                        {notes.map(note => (
                            <h2 key={note._id}>{note.title}</h2>
                        ))}
                    </div>
                )}
            </div>
        </div>
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
        <span className="loader">
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
        </span>
    )
}

export default HomePage;