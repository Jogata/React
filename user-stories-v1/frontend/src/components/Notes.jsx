import { useEffect, useState } from "react";
import Loader from "./Loader";

async function getAllNotes(url, onSuccess) {
    try {
        const res = await fetch(url);
        console.log(res);
    
        const data = await res.json();
        console.log("all notes: ", data);

        if (res.ok) {
            // setTimeout(() => {
            //     onSuccess(data.data);
            // }, 5000);
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
            setIsLoading(false);
            setIsSuccess(true);
        }
    }, [])

    let content = <Loader />;
    let tableContent = [];

    if (isLoading) {
        content = <Loader />
    } else if (isError) {
        content = <p>{error.message}</p>
    } else if (notes.length == 0) {
        return <p>No notes found</p>
    } else if (isSuccess) {
        content = (
            <table className="table notes">
                <thead className="table-thead">
                    <tr>
                        <th className="table-th note-status">Username</th>
                        <th className="table-th note-created">Created</th>
                        <th className="table-th note-updated">Updated</th>
                        <th className="table-th note-title">Title</th>
                        <th className="table-th note-username">Owner</th>
                        <th className="table-th note-edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content;
}

export default Notes;