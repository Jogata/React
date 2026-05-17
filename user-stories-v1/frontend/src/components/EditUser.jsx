import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import EditUserForm from "./EditUserForm";

async function getAllUsers(url) {
    try {
        const res = await fetch(url);
    
        const result = await res.json();
        console.log("all users: ", result.data);

        if (res.ok) {
            return result.data;
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
        loadUser();

        async function loadUser() {
            const res = await getAllUsers("http://localhost:5000/users");

            if (Array.isArray(res)) {
                const user = res.find(user => user._id == userId);
    
                if (user) {
                    setExist(true);
                    setUser(user);
                } else {
                    setExist(false);
                }
            } else {
                // TODO
                setExist(false);
            }
        }
    }, [])

    if (!exist) {
        return <UserDoesntExist id={userId} />;
    }

    const content = user ? <EditUserForm user={user} /> : <Loader />;

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