import { useEffect, useState } from "react";
import User from "./User";
import Loader from "./Loader";
import { Link } from "react-router-dom";

// async function getAllUsers(url, onSuccess, onFail) {
async function getAllUsers(url) {
    try {
        const res = await fetch(url);
        console.log(res.ok);
    
        // const result = await res.json();
        console.log("all users: ", res);

        // if (res.ok) {
        //     onSuccess(result.data);
        // } else {
        //     throw new Error(data);
        // }
        
        return res;

    } catch (error) {
        console.log(error.message);
        // onFail(error);
    }
}

const Users = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("loading");
    // const [isLoading, setIsLoading] = useState(false);
    // const [isSuccess, setIsSuccess] = useState(false);

    // const {
    //     isError,
    //     error
    // } = {
    //     isError: false,
    //     error: {}
    // };

    useEffect(() => {
        // getAllUsers("http://localhost:5000/users", onSuccess, onFail);
        setUpData();
        
        async function setUpData() {
            // setIsLoading(true);
            setStatus("loading");
            const res = await getAllUsers("http://localhost:5000/users");
            console.log(res);
            const result = await res.json();
            console.log(result);

            if (!res.ok) {
                setStatus("error");
                setMessages([result.message]);
                // setIsLoading(false);
            } else {
                setStatus("success");
                setUsers(result.data);
                // setIsLoading(false);
                // setIsSuccess(true);
            }
        }

        // function onSuccess(data) {
        //     setUsers(data);
        //     setIsLoading(false);
        //     setIsSuccess(true);
        // }

        // function onFail(err) {
        //     console.log(err.message);
        //     setIsLoading(false);
        //     setIsSuccess(false);
        // }
    }, [])

    let content;

    // if (isLoading) content = <Loader />
    if (status == "loading") content = <Loader />

    // if (isError) {
    if (status == "error") {
        // content = <p>{error.message}</p>
        content = <p>{messages[0]}</p>
    }

    // if (isSuccess) {
    if (status == "success") {
        const tableContent = users.length > 0 ? (
            users.map(user => (
                <User user={user} key={user._id} />
            ))
        ) : (
            <EmptyRow />
        )

        content = (
            <table className="table users">
                <thead className="table-thead">
                    <tr>
                        <th className="table-th user-username">Username</th>
                        <th className="table-th user-roles">Roles</th>
                        <th className="table-th user-edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                    <tr className="create-row">
                        <th scope="row" colSpan="2">Create new user</th>
                        <td>
                            <Link 
                                to="/dash/users/create"
                                className="icon-button"
                                title="Create new user"
                            >
                                Create new user
                                <i className="fa fa-user-plus"></i>
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
            <td colSpan="3">No users to display</td>
        </tr>
    )
}

export default Users;