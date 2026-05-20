import { useEffect, useState } from "react";
import Loader from "./Loader";
import { Link, useLocation } from "react-router-dom";
import Note from "./Note";

async function getAllNotes(url) {
    try {
        const res = await fetch(url);
        return res;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

const setUpMessages = (location) => {
    const initialState = location.state;
    
    if (initialState && initialState.message) {
        return [initialState];
    }

    return [];
}

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [status, setStatus] = useState("loading");
    const [errors, setErrors] = useState([]);
    
    const location = useLocation();
    const messages = setUpMessages(location);

    useEffect(() => {
        setUpData();

        async function setUpData() {
            try {
                setStatus("loading");
                const res = await getAllNotes("http://localhost:5000/notes");
        
                const result = await res.json();
        
                if (res.ok) {
                    setStatus("success");
                    setNotes(result.data);
                }
            } catch (error) {
                console.log(error.message);
                setStatus("error");
                setErrors([error]);
            }
        }
    }, [])

    const messagesClass = messages.length ? "successmsg" : "offscreen";

    let content = null;
    
    if (status == "loading") {
        content = <Loader />
    } else if (status == "error") {
        content = <p>{errors[0].message}</p>
    } else if (status == "success") {
        const tableContent = notes.length ? (
            <TableRows notes={notes} />
        ) : (
            <EmptyRow />
        )
        
        content = (
            <table className="table notes">
                <thead className="table-thead">
                    <tr>
                        <th className="table-th note-status">Status</th>
                        <th className="table-th note-created">Created</th>
                        <th className="table-th note-updated">Updated</th>
                        <th className="table-th note-title">Title</th>
                        <th className="table-th note-username">Owner</th>
                        <th className="table-th note-edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                    <tr className="create-row">
                        <th scope="row" colSpan="5">Create new note</th>
                        <td>
                            <Link 
                                to="/dash/notes/create"
                                className="icon-button"
                                title="Create new note"
                            >
                                Create new note
                                <i className="fa fa-file-text-o"></i>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    return (
        <>
            <div className="messages">
                <div className={messagesClass}>
                    {messages.map((message, index) => {
                        return (
                            <p key={index}>{message.message}</p>
                        )
                    })}
                </div>
            </div>

            {content}
        </>
    );
}

const EmptyRow = () => {
    return (
        <tr className="empty-row">
            <td colSpan="6">No notes to display</td>
        </tr>
    )
}

const TableRows = ({ notes }) => {
    const tableContent = notes.map(note => {
        return (
            <Note note={note} key={note._id} />
        )
    })

    return tableContent;
}

export default Notes;