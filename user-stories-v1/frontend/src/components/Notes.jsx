import { useEffect, useState } from "react";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import Note from "./Note";

async function getAllNotes(url, onSuccess) {
    try {
        const res = await fetch(url);
        // console.log(res);
    
        const data = await res.json();
        console.log("all notes: ", data);

        if (res.ok) {
            onSuccess(data.data);
        }

    } catch (error) {
        console.log(error);
    }
}

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isError = false;
    const error = {};
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getAllNotes("http://localhost:5000/notes", onSuccess);

        function onSuccess(data) {
            setNotes(data);
            // setNotes([]);
            setIsLoading(false);
            setIsSuccess(true);
        }
    }, [])

    let content = <Loader />;
    
    if (isLoading) {
        content = <Loader />
    } else if (isError) {
        content = <p>{error.message}</p>
    } else if (isSuccess) {
        const tableContent = notes.length ? <TableRows notes={notes} /> : <EmptyRow />
        
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

    return content;
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
            // <tr key={note._id}>
            //     <th>{note.title}</th>
            //     <td>{note.text}</td>
            // </tr>
            <Note note={note} key={note._id} />
        )
    })

    return tableContent;
}

export default Notes;