// import { useEffect, useState } from "react";
// import User from "./User";
// import Loader from "./Loader";
// import { Link, useLocation } from "react-router-dom";

// async function getAllUsers(url) {
//     try {
//         const res = await fetch(url);
//         return res;
//     } catch (error) {
//         console.log(error.message);
//         throw new Error(error.message);
//     }
// }

// const setUpMessages = (location) => {
//     const initialState = location.state;
    
//     if (initialState && initialState.message) {
//         return [initialState];
//     }

//     return [];
// }

// const Users = () => {
//     const [users, setUsers] = useState([]);
//     const [status, setStatus] = useState("loading");
//     const [errors, setErrors] = useState([]);

//     const location = useLocation();
//     const messages = setUpMessages(location);

//     useEffect(() => {
//         setUpStates();
        
//         async function setUpStates() {
//             try {
//                 setStatus("loading");
//                 const res = await getAllUsers("http://localhost:5000/users");
//                 const result = await res.json();
    
//                 if (!res.ok) {
//                     console.log(result);
//                     setStatus("error");
//                     setErrors([result]);
//                 } else {
//                     setStatus("success");
//                     setUsers(result.data);
//                 }
//             } catch (error) {
//                 console.log("server error");
//                 setStatus("error");
//                 setErrors([error]);
//             }
//         }
//     }, [])

//     const successMsgClass = messages.length > 0 ? "successmsg" : "offscreen";

//     let content;

//     if (status == "loading") content = <Loader />

//     if (status == "error") {
//         content = <p>{errors[0].message}</p>
//     }

//     if (status == "success") {
//         const tableContent = users.length > 0 ? (
//             users.map(user => (
//                 <User user={user} key={user._id} />
//             ))
//         ) : (
//             <EmptyRow />
//         )

//         content = (
//             <table className="table users">
//                 <thead className="table-thead">
//                     <tr>
//                         <th className="table-th user-username">Username</th>
//                         <th className="table-th user-roles">Roles</th>
//                         <th className="table-th user-edit">Edit</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tableContent}
//                     <tr className="create-row">
//                         <th scope="row" colSpan="2">Create new user</th>
//                         <td>
//                             <Link 
//                                 to="/dash/users/create"
//                                 className="icon-button"
//                                 title="Create new user"
//                             >
//                                 Create new user
//                                 <i className="fa fa-user-plus"></i>
//                             </Link>
//                         </td>
//                     </tr>
//                 </tbody>
//             </table>
//         )
//     }

//     return (
//         <>
//             <div className="messages">
//                 <div className={successMsgClass}>
//                     {messages.map((message, index) => {
//                         return <p key={index}>{message.message}</p>
//                     })}
//                 </div>
//             </div>
//             {content}
//         </>
//     );
// }

// const EmptyRow = () => {
//     return (
//         <tr className="empty-row">
//             <td colSpan="3">No users to display</td>
//         </tr>
//     )
// }

// export default Users;

import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const NavigationTest = () => (
    <nav>
        <ul role="list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/protected">Protected</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li>
                <button
                    title="Logout"
                    onClick={() => console.log("todo logout")}
                >
                    Log Out
                </button>
            </li>
        </ul>
    </nav>
)

const RegisterTest = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const result = await (await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })).json();
        if (!result.error) {
            console.log(result.message);
            navigate("/");
        } else {
            console.log(result.error);
        }
    };

    const handleChange = e => {
        if (e.currentTarget.name === "username") {
            setUsername(e.currentTarget.value);
        } else {
            setPassword(e.currentTarget.value);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <div>Register</div>
                <div className="login-input">
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
};

const LoginTest = () => {
    const [user, setUser] = useState({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const result = await (await fetch("http://localhost:5000/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })).json();

        if (result.accesstoken) {
            setUser({
                accesstoken: result.accesstoken,
            });
            navigate("/");
        } else {
            console.log(result.error);
        }
    };

    useEffect(() => {
        console.log(user);
    }, [user])

    const handleChange = e => {
        if (e.currentTarget.name === "username") {
            setUsername(e.currentTarget.value);
        } else {
            setPassword(e.currentTarget.value);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <div>Login</div>
                <div className="login-input">
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};

const ProtectedComponent = () => {
    const [user] = useState({});
    const [content, setContent] = useState("You need to login");
  
    useEffect(() => {
      async function fetchProtected() {
        const result = await (await fetch("http://localhost:5000/protected", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.accesstoken}`,
          },
        })).json();
        if (result.data) setContent(result.data);
      }
      fetchProtected();
    }, [user])
  
    return <div>{content}</div>;
  }

const Content = () => {
  const [user] = [{accesstoken: "donot"}];
  if (!user.accesstoken) {
    console.log("redirect");
    return <Navigate to="/login" />
  }
  return <div>This is the content.</div>;
}

export const Test = {
    NavigationTest, 
    RegisterTest, 
    ProtectedComponent, 
    LoginTest
}