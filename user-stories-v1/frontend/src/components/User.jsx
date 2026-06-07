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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/login", {
        method: "POST", 
        body: JSON.stringify({ username, password })
      });
      console.log(res);
      const data = res.json();
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
        <div className="login">
          <form onSubmit={handleLoginSubmit}>
            <span className="form-title">Login</span>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
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