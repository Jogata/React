import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import Loader from "./Loader";

async function getAllUsers(url, onSuccess) {
    try {
        const res = await fetch(url);
    
        const data = await res.json();
        console.log("all users: ", data);

        if (res.ok) {
            onSuccess(data);
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
    const [users, setUsers] = useState([]);
    const [notes, setNotes] = useState([]);
    // console.log(id);

    let note = null;
    if (notes.length) {
        note = notes.find(note => note._id == id);
        console.log(note);
    }
    // const users = [];

    useEffect(() => {
        // setIsLoading(true);
        getAllUsers("http://localhost:5000/users", onGetUsersSuccess);
        getAllNotes("http://localhost:5000/notes", onGetNotesSuccess);

        function onGetUsersSuccess(data) {
            setUsers(data.data);
            // setUsers([])
            // setIsLoading(false);
            // setIsSuccess(true);
        }

        function onGetNotesSuccess(data) {
            setNotes(data.data);
            // setUsers([])
            // setIsLoading(false);
            // setIsSuccess(true);
        }
    }, [])

    const content = note && users.length ? (
        <EditNoteForm note={note} users={users} />
    ) : (
        // <p>Loading...</p>
        <Loader />
    )

    return content;
}

export default EditNote;