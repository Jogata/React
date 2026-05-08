import { useState, useEffect } from "react";
import CreateNoteForm from "./CreateNoteForm";
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
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getAllUsers("http://localhost:5000/users", onSuccess);

        function onSuccess(data) {
            setUsers(data.data);
            setIsLoading(false);
            // setIsSuccess(true);
        }
    }, [])

    if (isLoading) return <Loader />

    if (!users?.length) return <p>Not Currently Available</p>
    // if (!users?.length) {
    //     console.log(users);
    //     return <p>Not Currently Available</p>
    // }
    

    const content = <CreateNoteForm users={users} />

    return content;
}

export default NewNote;