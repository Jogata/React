import { useState, useEffect, useRef } from "react";
import CreateNoteForm from "./CreateNoteForm";
import Loader from "./Loader";
import { Link } from "react-router-dom";

async function getAllUsers(url, onSuccess, token) {
    try {
        const res = await fetch(url, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        });
    
        const data = await res.json();
        console.log("all users: ", data);

        if (res.ok) {
            onSuccess(data);
        }

    } catch (error) {
        console.log(error);
    }
}

const NewNote = ({token}) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [isSuccess, setIsSuccess] = useState(false);
    // const [isError, setIsError] = useState(false);              TODO

    useEffect(() => {
        setIsLoading(true);
        getAllUsers("http://localhost:5000/users", onSuccess, token);

        function onSuccess(data) {
            setUsers(data.data);
            // setUsers([])
            setIsLoading(false);
            // setIsSuccess(true);
        }
    }, [])

    if (isLoading) return <Loader />

    if (!users?.length) return <NotAvailableSection />

    const content = <CreateNoteForm users={users} />

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

export default NewNote;