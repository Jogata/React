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




import { createContext, useContext, useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import Loader from "./Loader";

function Navigation(props) {
    const navigate = useNavigate();
    const setUser = props.setUser;

    const logout = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/logout", {
                credentials: "include", 
            });
            const result = await response.json();
            console.log(result);

            if (response.ok) {
                console.log("logout success from browser");
                setUser({});
            }
        } catch (error) {
            console.log(error.message);
        }

        navigate("/login");
    };

    return (
        <nav>
            <ul className="list-style-none">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/dash">Dashboard</Link>
                </li>
                <li>
                    <Link to="/dash2">Dashboard 2</Link>
                </li>
                <li>
                    <button
                        className="submit-button"
                        title="Logout"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    )
}

function Home() {
    // const navigate = useNavigate();
    // const setUser = props.setUser;

    // const logout = async () => {
    //     try {
    //         const response = await fetch(
    //             "http://localhost:5000/logout", {
    //             credentials: "include", 
    //         });
    //         const result = await response.json();
    //         console.log(result);

    //         if (response.ok) {
    //             console.log("logout success from browser");
    //             setUser({});
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //     }

    //     navigate("/login");
    // };
 
    // const getPayment = async () => {
    //     const response = await fetch("http://localhost:5000/payment", {
    //         withCredentials: true,
    //     });
    //     console.log("Response: ", response);
    // };

    return (
        <>
            <h1>Welcome Home Bud!</h1>
            {/* <button 
                className="submit-button"
                onClick={getPayment}
            >
                Get Payment
            </button> */}
            {/* <Link to="/dash">
                Dashboard
            </Link> */}
            {/* <button 
                className="submit-button"
                onClick={logout}
            >
                Logout
            </button> */}
        </>
    );
}

function Register() {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("user5");
    //   const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass1235");
    //   const [password, setPassword] = useState("");

    const handleSubmit = async (e, values) => {
        e.preventDefault();
        console.log("Values: ", values);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:5000/register", {
                method: "POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            console.log(result);
        } catch (err) {
            console.log("Error: ", err);
            setError(err.message);
        }
    };

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e, {username, password})}>
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

                <Link className="redirect-link" to="/login">
                    Login
                </Link>

            </form>
        </>
    );
}

function Profile() {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function getProfile() {            
            try {
                const response = await fetch(
                    "http://localhost:5000/profile", {
                    // method: "POST",
                    credentials: "include", 
                    // headers: {
                    //     "Content-Type": "application/json",
                    // },
                    // body: JSON.stringify(values),
                });
                console.log(response);
                        
                if (!response.ok) {
                    // setUser({isAuth: true});
                    console.log("unautorized");
                    navigate("/");
                }
                
                // if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    setProfile(result);
                    setLoading(false);
                // }                
        
            } catch (err) {
                console.log("Error: ", err);
                setError(err.message);
            }
        }

        getProfile();
    }, [])

    if (!profile.username) {
        console.log("will redirect");
        // return navigate("/login");
        return <Navigate to="login" replace />
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className="profile">
            <h1>{profile.username}</h1>
        </div>
    )
};

function Profile2() {
    const { fetchWithAuth } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchWithAuth("http://localhost:5000/profile2")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log("Request blocked or unauthorized."));
    }, []);

    return (
        <div>
            <h2>User Profile</h2>
            {
                data
                 ? <p>{data.secretInfo}</p>
                 : <Loader />}
        </div>
    );
}

function Login(props) {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("user5");
    //   const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass1235");
    //   const [password, setPassword] = useState("");
    const setUser = props.setUser;

    const handleSubmit = async (e, values) => {
        e.preventDefault();
        console.log("Values: ", values);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:5000/login", {
                method: "POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            console.log(response);
            
            // if (response.ok) {
                const result = await response.json();
                console.log(result);
            // }

            if (response.ok) {
                setUser({isAuth: true});
            }

        } catch (err) {
            console.log("Error: ", err);
            setError(err.message);
        }
    };

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e, {username, password})}>
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

                <Link className="redirect-link" to="/register">
                    Register
                </Link>

            </form>
            <div className="links">
                <Link className="redirect-link" to="/dash">
                    Dashboard
                </Link>
            </div>
        </>
    );
}

function Dashboard() {
    useEffect(() => {
        try {
            const getPayment = async () => {
                const response = await fetch("http://localhost:5000/payment", {
                    // withCredentials: true, 
                    credentials: "include"
                });
                // console.log("Response: ", response);
                const result = await response.text();
                console.log(result);
            };
            getPayment();
        } catch (error) {
            console.log(error.message);
        }
    }, [])

    const date = new Date();
    const today = new Intl.DateTimeFormat(
        "en-US", { 
            dateStyle: "full", 
            timeStyle: "long" 
        }).format(date);

    const username = "<USER>";

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {username}!</h1>

            <p>
                <Link to="/dash/notes">
                    View techNotes
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/dash/notes/create">
                    Add New techNote
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/dash/users">
                    View All Users
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/dash/users/create">
                    Add New User
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/">
                    Home
                </Link>
            </p>

        </section>
    )

    return content;
}

function Dashboard2() {
    const date = new Date();
    const today = new Intl.DateTimeFormat(
        "en-US", { 
            dateStyle: "full", 
            timeStyle: "long" 
        }).format(date);

    const username = "<USER>";

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome to Dash2 {username}!</h1>

            <p>
                <Link to="/dash/notes">
                    View techNotes
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/dash/notes/create">
                    Add New techNote
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/dash/users">
                    View All Users
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/dash/users/create">
                    Add New User
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/">
                    Home
                </Link>
            </p>

        </section>
    )

    return content;
}

function Protected(props) {
    const user = props.user;
    // const setUser = props.setUser;
    // console.log(props);
    const navigate = useNavigate();

    // const test = {
    //     has: 1
    // }

    // console.log(Object.hasOwn(test, "has"));
    // console.log(Object.hasOwn(test, "hass"));
    // console.log(Object.hasOwn(props, "user"));

    useEffect(() => {
        console.log("protected mounted");
        // const user = props.user;
        const setUser = props.setUser;
    
        try {
            const check = async () => {
                const response = await fetch("http://localhost:5000/protected", {
                    // withCredentials: true, 
                    credentials: "include"
                });
                // console.log("Response: ", response);
                const result = await response.text();
                console.log(result);

                if (!response.ok) {
                    setUser({});
                    // navigate("/");
                }
            };
            check();
        } catch (error) {
            console.log(error.message);
        }

        return () => {
            console.log("cleanup protected", props.clean);
        }
    }, [])


    if (!Object.hasOwn(props, "user")) {
        console.log("Missing user prop");
        return (
            <div>
                <h1>Missing user</h1>
                <Link to="/">Home</Link>
            </div>
        )
    }

    if (user) {
        const isAuth = user.isAuth;

        if (isAuth) {
            return <Outlet />
        }
    }

    console.log("unautorised");
    return (
        <div>
            <h1>You must log in</h1>
            <Link to="/login">Login</Link>
        </div>
    )
}

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => setUser(null);

    const checkAuth = async () => {
        try {
            const res = await fetch("http://localhost:5000/me", { 
                credentials: "include" 
            });
            
            if (res.status === 401) {
                logout();
            } else if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (err) {
            logout();
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        }
    };

    const fetchWithAuth = async (url, options = {}) => {
        options.credentials = "include";

        const response = await fetch(url, options);

        if (response.status === 401) {
            logout();
            throw new Error("Unauthorized session");
        }

        return response;
    };

    useEffect(() => {
        checkAuth();

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                checkAuth();
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    if (loading) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, fetchWithAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const Test = { 
    useAuth: () => useContext(AuthContext), 
    AuthProvider, 
    Navigation, 
    Home, 
    Register, 
    Login, 
    Dashboard, 
    Dashboard2, 
    Protected, 
    Profile, 
    Profile2
};