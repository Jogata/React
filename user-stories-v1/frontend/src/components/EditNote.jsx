import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import Loader from "./Loader";

async function getAllUsers(url, onSuccess) {
    try {
        const res = await fetch(url);
    
        const data = await res.json();
        console.log("all users: ", data);

        if (res.ok) {
            onSuccess(data);
            // onSuccess({data: []});
            return data;
        }

    } catch (error) {
        console.log(error);
    }
}

async function getAllNotes(url, onSuccess) {
    try {
        const res = await fetch(url);
    
        const data = await res.json();
        console.log("all notes: ", data);

        if (res.ok) {
            onSuccess(data);
        }

    } catch (error) {
        console.log(error);
    }
}

const EditNote = () => {
    const { id } = useParams();
    const [users, setUsers] = useState(null);
    const [notes, setNotes] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    let note = null;
    if (notes) {
        note = notes.find(note => note._id == id);
        // console.log(note);
    }

    useEffect(() => {
        setUpInitialData();

        async function setUpInitialData() {
            const res = await getAllUsers("http://localhost:5000/users", onGetUsersSuccess);
            console.log(res);

            if (res.data.length) {
                await getAllNotes("http://localhost:5000/notes", onGetNotesSuccess);
                setIsLoading(false);
            }

            function onGetUsersSuccess(data) {
                setUsers(data.data);
            }
    
            function onGetNotesSuccess(data) {
                setNotes(data.data);
            }
        }
    }, [])

    let content = null;

    if (isLoading) {
        content = <Loader />;
    } else if (users) {
        if (users.length == 0) {
            content = <NotAvailableSection />;
        } else if (note) {
            content = <EditNoteForm note={note} users={users} />;
        } else {
            content = <NoteDoesntExist id={id} />;
        }
    }

    return content;
}

const NotAvailableSection = () => {
    return (
        <section className="not-available-section">
            <h1>Not Currently Available</h1>
            <div className="links">
                <Link to="/dash/users/create" className="redirect-link">
                    Create New User
                </Link>
                <Link to="/dash" className="redirect-link">
                    Dashboard
                </Link>
            </div>
        </section>
    )
}

const NoteDoesntExist = ({ id }) => {
    return (
        <div className="invalid-user">
            <p>
                Note with id <span>{`${id}`}</span> doesn't exist
            </p>
            <Link to="/dash/notes">Browse All Notes</Link>
        </div>
    )
}

export default EditNote;