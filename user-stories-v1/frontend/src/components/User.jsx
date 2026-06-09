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
    const [username, setUsername] = useState("john");
    const [password, setPassword] = useState("John0908");

    const refreshToken = async () => {
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
        <div className="container">
            <nav>
                <button 
                    className="nav-button"
                    onClick={refreshToken}
                >
                    Refresh
                </button>
            </nav>
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
        </div>
    );
}