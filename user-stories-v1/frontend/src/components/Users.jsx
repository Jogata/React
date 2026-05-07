import { useEffect, useState } from "react";
import User from "./User";
import Loader from "./Loader";
import { Link } from "react-router-dom";

async function getAllUsers(url, onSuccess) {
    try {
        const res = await fetch(url);
        console.log(res.ok);
    
        const data = await res.json();
        console.log("all users: ", data.data);

        if (res.ok) {
            onSuccess(data.data);
        } else {
            throw new Error(data);
        }

    } catch (error) {
        // console.log(error);
        onFail(error);
    }
}

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        isError,
        error
    } = {
        isError: false,
        error: {}
    };

    useEffect(() => {
        setIsLoading(true);
        getAllUsers("http://localhost:5000/users", onSuccess, onFail);

        function onSuccess(data) {
            setUsers(data);
            setIsLoading(false);
            setIsSuccess(true);
        }

        function onFail(err) {
            console.log(err.message);
            setIsLoading(false);
            setIsSuccess(false);
        }
    }, [])

    let content;

    if (isLoading) content = <Loader />

    if (isError) {
        content = <p>{error.message}</p>
    }

    if (isSuccess) {
        const tableContent = users.length > 0 ? (
            users.map(user => (
                <User user={user} key={user._id} />
            ))
        ) : (
            // <p>no users to display</p>
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
                    <tr className="new-user-row">
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