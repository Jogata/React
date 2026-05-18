import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import EditUserForm from "./EditUserForm";

async function getAllUsers(url) {
    try {
        const res = await fetch(url);
    
        // const result = await res.json();
        console.log("all users: ", res);

        // if (res.ok) {
            // return result.data;
        // }

        return res;

    } catch (error) {
        console.log(error);
    }
}

const EditUser = () => {
    const { userId } = useParams();
    const [ user, setUser ] = useState(null);
    // const [ exist, setExist ] = useState(true);
    const [ status, setStatus ] = useState("loading");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        loadUser();

        async function loadUser() {
            const res = await getAllUsers("http://localhost:5000/users");

            if (!res.ok) {
                setStatus("error");
            } else {
                const result = await res.json();
                const users = result.data;

                if (Array.isArray(users)) {
                    const user = users.find(user => user._id == userId);
        
                    if (user) {
                        // setExist(true);
                        setStatus("success");
                        setUser(user);
                    } else {
                        setStatus("fail");
                        // setExist(false);
                        setMessages(["User doesn't exist"]);
                    }
                } else {
                    // TODO
                    // setExist(false);
                    setStatus("error");
                    setMessages([result.message]);
                }
            }

        }
    }, [])

    if (status == "loading") {
        return <Loader />;
    }

    // if (!exist) {
    if (status == "fail") {
        return <UserDoesntExist id={userId} />;
    }

    const content = status == "success" ? <EditUserForm user={user} /> : <p>{messages[0]}</p>;

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