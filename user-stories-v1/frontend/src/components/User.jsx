import { Link } from "react-router-dom";

const User = ({ user }) => {
    if (user) {
        const userRolesString = user.roles.toString().replaceAll(",", ", ");

        const cellStatus = user.active ? "active" : "inactive";

        return (
            <tr className="table-row user">
                <td className={`table-cell ${cellStatus}`}>{user.username}</td>
                <td className={`table-cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table-cell edit-col ${cellStatus}`}>
                    <Link
                        to={`/dash/users/edit/${user._id}`}
                        className="icon-button table-button"
                        title="Edit"
                    >
                        Edit user
                        <i className="fa fa-pencil-square-o"></i>
                    </Link>
                </td>
            </tr>
        )
    } else {
        return null;
    }
}

export default User;

import { useState } from "react";

export function Test() {
    const [user, setUser] = useState(null);
    // const [username, setUsername] = useState("john");
    // const [password, setPassword] = useState("John0908");
    // const [error, setError] = useState(false);
    // const [success, setSuccess] = useState(false);

    const handleRefreshToken = async () => {
        if (!user) {
            console.log("User not logged in");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({ token: user.refreshToken })
            });

            let data = null;

            if (res.ok) {
                data = await res.json();
                setUser({
                    ...user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                });
            } else {
                const error = await res.json();
                console.log(error);
            }
            return data;
        } catch (err) {
            console.log(err);
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users");

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="container">
            <nav>
                <button
                    className="nav-button"
                    onClick={handleRefreshToken}
                    title="Refresh token"
                >
                    Refresh
                </button>
                {/* <button
                    className="delete-button"
                    onClick={() => handleDelete(user)}
                    title="Delete user"
                >
                    Delete
                </button> */}
                <button
                    className="nav-button"
                    onClick={getAllUsers}
                    title="All users"
                >
                    Get All Users
                </button>
            </nav>
            {
                user ? (
                    <Home user={user} />
                ) : (
                    <LoginForm setUser={setUser} />
                )
            }
        </div>
    );
}

function Home({ user }) {
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDelete = async (user, id) => {
        setSuccess(false);
        setError(false);

        if (!user) {
            console.log("User not logged in");
            return;
        }

        try {
            await fetch("http://localhost:5000/api/users/" + id, {
                method: "DELETE",
                headers: {
                    // authorization: "Bearer " + user.accessToken 
                    "Authorization": `Bearer ${user.accessToken}`
                },
            });
            setSuccess(true);
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className="home">
            <span>
                Welcome to the <b>{user.isAdmin ? "admin" : "user"}</b> dashboard{" "} <b>{user.username}</b>.
            </span>
            <span>Delete Users:</span>
            <button 
                className="delete-button" 
                onClick={() => handleDelete(user, 1)}
            >
                Delete John
            </button>
            <button 
                className="delete-button" 
                onClick={() => handleDelete(user, 2)}
            >
                Delete Jane
            </button>
            {error && (
                <span className="error">
                    You are not allowed to delete this user!
                </span>
            )}
            {success && (
                <span className="success">
                    User has been deleted successfully...
                </span>
            )}
        </div>
    )
}

function LoginForm({ setUser }) {
    const [username, setUsername] = useState("john");
    const [password, setPassword] = useState("John0908");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({ username, password })
            });
            console.log(res);
            const data = await res.json();
            console.log(data);
            setUser(data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleLoginSubmit}>
                <span className="form-title">Login</span>
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="submit-button"
                >
                    Login
                </button>
            </form>
        </div>
    )
}