// import { Link } from "react-router-dom";

const User = ({ user }) => {
//     if (user) {
//         const userRolesString = user.roles.toString().replaceAll(",", ", ");

//         const cellStatus = user.active ? "active" : "inactive";

//         return (
//             <tr className="table-row user">
//                 <td className={`table-cell ${cellStatus}`}>{user.username}</td>
//                 <td className={`table-cell ${cellStatus}`}>{userRolesString}</td>
//                 <td className={`table-cell edit-col ${cellStatus}`}>
//                     <Link
//                         to={`/dash/users/edit/${user._id}`}
//                         className="icon-button table-button"
//                         title="Edit"
//                     >
//                         Edit user
//                         <i className="fa fa-pencil-square-o"></i>
//                     </Link>
//                 </td>
//             </tr>
//         )
//     } else {
//         return null;
//     }
}

export default User;




import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const logout = () => {
        navigate("/login");
    };
 
    const getPayment = async () => {
        const response = await fetch("http://localhost:5000/payment", {
            withCredentials: true,
        });
        console.log("Response: ", response);
    };

    return (
        <>
            <h1>Welcome Home Bud!</h1>
            <button 
                className="submit-button"
                onClick={getPayment}
            >
                Get Payment
            </button>
            <button 
                className="submit-button"
                onClick={logout}
            >
                Logout
            </button>
        </>
    );
}

function Register() {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("user5");
    //   const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass1235");
    //   const [password, setPassword] = useState("");

    const handleSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/v1/register", {
                method: "POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
        } catch (err) {
            console.log("Error: ", err);
            setError(err.message);
        }
    };

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Welcome Back!</h1>
                <p style={{ color: "red" }}>{error}</p>
                <label htmlFor="username" className="form-label">
                    Username:
                </label>
                <input
                    className="form-input"
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />
                <label htmlFor="password" className="form-label">
                    Password:
                </label>
                <input
                    className="form-input"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                <button
                    className="submit-button"
                    title="Register"
                >
                    Register
                </button>

            </form>
        </>
    );
}

function Login() {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("user5");
    //   const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass1235");
    //   const [password, setPassword] = useState("");

    const handleSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:9000/api/v1/login", {
                method: "POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            }
            );

            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { email: values.email },
            });
        } catch (err) {
            console.log("Error: ", err);
            setError(err.message);
        }
    };

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Welcome Back!</h1>
                <p style={{ color: "red" }}>{error}</p>
                <label htmlFor="username" className="form-label">
                    Username:
                </label>
                <input
                    className="form-input"
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />
                <label htmlFor="password" className="form-label">
                    Password:
                </label>
                <input
                    className="form-input"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                <button
                    className="submit-button"
                    title="Login"
                >
                    Login
                </button>

            </form>
        </>
    );
}

export const Test = { 
    Home, 
    Register, 
    Login
 };