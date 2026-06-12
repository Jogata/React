import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import EditUserForm from "./EditUserForm";

async function getAllUsers(url, token) {
    try {
        // const res = await fetch(url);
        const res = await fetch(url, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        });
        // console.log(res);
        return res;

    } catch (error) {
        console.log(error);
    }
}

const EditUser = ({token}) => {
    const { userId } = useParams();
    const [ user, setUser ] = useState(null);
    const [ status, setStatus ] = useState("loading");
    const [ messages, setMessages ] = useState([]);

    useEffect(() => {
        loadUser();

        async function loadUser() {
            const res = await getAllUsers("http://localhost:5000/users", token);

            if (!res.ok) {
                const result = await res.json();
                console.log(result);
                // const message = result.message;
                setMessages([result.error]);
                setStatus("error");
            } else {
                const result = await res.json();
                const users = result.data;

                if (Array.isArray(users)) {
                    const user = users.find(user => user._id == userId);
        
                    if (user) {
                        setStatus("success");
                        setUser(user);
                    } else {
                        setStatus("fail");
                        setMessages(["User doesn't exist"]);
                    }
                } else {
                    // TODO
                    setStatus("error");
                    setMessages([result.message]);
                }
            }

        }
    }, [])

    if (status == "loading") {
        return <Loader />;
    }

    if (status == "fail") {
        return <UserDoesntExist id={userId} />;
    }

    if (status == "success") {
        return <EditUserForm user={user} token={token} />;
    }

    if (status == "error") {
        return <ErrorSection message={messages[0].message} />;
        //     <>
        //         <p>{messages[0].message}</p>
        //         <div className="links">
        //             <Link to="/login" className="redirect-link">
        //                 Login
        //             </Link>
        //         </div>
        //     </>
        // )
    }
}

const UserDoesntExist = ({ id }) => {
    return (
        <div className="error-section">
            <p>
                User with id <span>{`${id}`}</span> doesn't exist
            </p>
            <Link to="/dash/users">Browse All Users</Link>
        </div>
    )
}

const ErrorSection = ({ message }) => {
    return (
        <div className="error-section">
            <p>{message}</p>
            {/* <div className="links"> */}
            <Link to="/login" className="redirect-link">
                Login
            </Link>
            {/* </div> */}
        </div>
    )
}

export default EditUser;