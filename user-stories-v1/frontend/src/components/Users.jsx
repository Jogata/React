import { useEffect, useState } from "react";
import User from "./User";
import Loader from "./Loader";

async function getAllUsers(url, onSuccess) {
    try {
        const res = await fetch(url);
        // console.log(res.status);
        // console.log(res.ok);
        // console.log(res);
    
        const data = await res.json();
        console.log("all users: ", data);

        if (res.ok) {
            onSuccess(data);
        }

    } catch (error) {
        console.log(error);
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
        getAllUsers("http://localhost:5000/users", onSuccess);

        function onSuccess(data) {
            setUsers(data);
            setIsLoading(false);
            setIsSuccess(true);
        }
    }, [])

    let content;

    // if (isLoading) content = <p>Loading...</p>
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
            <p>no users to display</p>
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
                </tbody>
            </table>
        )
    }

    return content;
}

export default Users;