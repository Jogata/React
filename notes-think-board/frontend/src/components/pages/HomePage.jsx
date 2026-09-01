import { useState } from "react";
import { Link } from "react-router";

const HomePage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="">
            <div className="">
                {loading && <h1>Loading notes...</h1>}

                {notes && notes.length === 0 && <NotesNotFound />}

                {notes && notes.length > 0 && (
                    <div className="">
                        {notes.map((note) => (
                            <h2>{note.title}</h2>
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

export default HomePage;