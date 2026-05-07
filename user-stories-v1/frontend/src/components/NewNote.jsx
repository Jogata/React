import { useState, useEffect } from "react";
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

const NewNote = () => {
    // const users = [];
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getAllUsers("http://localhost:5000/users", onSuccess);

        function onSuccess(data) {
            setUsers(data);
            setIsLoading(false);
            // setIsSuccess(true);
        }
    }, [])

    if (isLoading) return <Loader />

    if (!users?.length) return <p>Not Currently Available</p>

    const content = <NewNoteForm users={users} />

    return content;
}

const NewNoteForm = ({ users }) => {
    return (
        <h1>New Note Form</h1>
    )
}

export default NewNote;