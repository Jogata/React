import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import EditUserForm from "./EditUserForm";

async function getAllUsers(url) {
    try {
        const res = await fetch(url);
    
        const data = await res.json();
        console.log("all users: ", data);

        if (res.ok) {
            return data;
        }

    } catch (error) {
        console.log(error);
    }
}

const EditUser = () => {
    const { userId } = useParams();
    const [ user, setUser ] = useState(null);
    const [ exist, setExist ] = useState(true);

    useEffect(() => {
        // setIsLoading(true);
        loadUser();

        async function loadUser() {
            const res = await getAllUsers("http://localhost:5000/users");

            if (Array.isArray(res)) {
                const user = res.find(user => user._id == userId);
                // const user = null;
                console.log(user);
    
                if (user) {
                    setExist(true);
                    setUser(user);
                } else {
                    setExist(false);
                }
            } else {
                setExist(false);
            }
            // setUsers(data);
            // setIsLoading(false);
            // setIsSuccess(true);
        }
    }, [])

    // const user = null;
    // const user = {
    //     roles: ["Employee"], 
    //     active: true
    // };

    if (!exist) {
        return <UserDoesntExist id={userId} />;
    }

    const content = user ? <EditUserForm user={user} /> : <Loader />

    return content;
}

const UserDoesntExist = ({ id }) => {
    return (
        <div className="invalid-user">
            <p>
                User with id <span>{`${id}`}</span> doesn't exist
            </p>
            <Link to="/dash/users">Browse All Users</Link>
        </div>
    )
}

export default EditUser;