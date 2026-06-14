import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import Loader from "./Loader";

async function getAllUsers(url, token) {
    try {
        const res = await fetch(url, {
            headers: {
                // "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
        });
    
        return res;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

async function getAllNotes(url, token) {
    try {
        const res = await fetch(url, {
            headers: {
                // "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
        });
    
        return res;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

const EditNote = ({token}) => {
    const { noteId } = useParams();
    const [users, setUsers] = useState(null);
    const [notes, setNotes] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState("loading");
    const [errors, setErrors] = useState([]);

    let note = null;
    if (notes) {
        note = notes.find(note => note._id == noteId);
    }

    useEffect(() => {
        setUpInitialData();

        async function setUpInitialData() {
            try {
                const res = await getAllUsers("http://localhost:5000/users", token);
                
                if (res.ok) {
                    const result = await res.json();
                    setUsers(result.data);
                    
                    if (result.data.length) {
                        const res = await getAllNotes("http://localhost:5000/notes", token);
                        
                        if (res.ok) {
                            const result = await res.json();
                            setNotes(result.data);
                            setStatus("success");
                        } else {
                            setStatus("error");
                            setErrors([res.message]);
                        }
                    }
                } else {
                    setStatus("error");
                    setErrors([res.message]);
                }
            } catch (error) {
                console.log(error.message);
                setStatus("error");
                setErrors([error.message]);
            }
        }
    }, [])

    let content = null;

    if (status == "loading") {
        content = <Loader />;
    } else if (status == "error") {
        content = <p>{errors[0]}</p>
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
        // <div className="invalid-user">
        <div className="error-section">
            <p>
                Note with id <span>{`${id}`}</span> doesn't exist
            </p>
            <Link to="/dash/notes">Browse All Notes</Link>
        </div>
    )
}

export default EditNote;