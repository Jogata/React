import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const url = "http://localhost:5000/auth";
const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{6,12}$/;

function parseJwt(token) {
    if (!token) return null;

    try {
        const base64Url = token.split(".")[1];

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid JWT token format:", error);
        return null;
    }
}
 
const CheckUserStatus = ({setToken}) => {
    const user = localStorage.getItem("user");
    const location = useLocation();
    console.log(location.state?.from.pathname);
    const previousPage = location.state?.from.pathname || "/dash";

    if (user) {
        // return <Navigate to="/dash" replace />;
        return <Navigate to={previousPage} replace />;
    }

    return <Login setToken={setToken} />
}

const Login = ({setToken}) => {
    // const [username, setUsername] = useState("");
    const [username, setUsername] = useState("user5");
    // const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass1235");
    const [persist, setPersist] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState([]);
    // const [messages, setMessages] = useState([]);
    const formSubmitedOnce = useRef(false);
    const userRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist(prev => !prev);

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log("form submitted");

        const validationErrors = [];

        if (username.length == 0) {
            validationErrors.push({
                message: "Each user must have a name"
            });
        } else if (username.length < 3) {
            validationErrors.push({
                message: "The name of the user must be atleast 3 characters"
            });
        } else if (!USER_REGEX.test(username)) {
            validationErrors.push({
                message: "The name of the user must contains only letters and numbers"
            });
        }

        if (password.length == 0) {
            validationErrors.push({
                message: "Each user must have a password"
            });
        } else if (password.length < 6) {
            validationErrors.push({
                message: "The password must be atleast 6 characters"
            });
        } else if (!PWD_REGEX.test(password)) {
            validationErrors.push({
                message: "The password contains inappropriate symbols"
            });
        }

        if (isPending) {
            setErrors([{ message: "Wait" }]);
        } else {
            formSubmitedOnce.current = true;

            if (validationErrors.length == 0) {
                try {
                    setIsPending(true);

                    const res = await fetch(url, {
                        method: "POST",
                        credentials: "include", 
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, password }),
                    });

                    const result = await res.json();
                    console.log(result);

                    if (res.ok) {
                        // setIsPending(false);
                        // setMessages([result]);
                        // setErrors([]);
                        setToken(result.accessToken);
                        // formSubmitedOnce.current = false;
                        const tokenData = parseJwt(result.accessToken);
                        console.log(tokenData.user);
                        localStorage.setItem("user", JSON.stringify(tokenData.user));
                        navigate("/");
                        // navigate(previousPage);
                        // console.log("redirect");
                    } else {
                        console.log("server errors", result);
                        setIsPending(false);
                        // setMessages([]);
                        setErrors([result]);
                        formSubmitedOnce.current = false;
                    }
                } catch (error) {
                    console.log(error.message);
                    formSubmitedOnce.current = false;
                    setIsPending(false);
                    // setMessages([]);
                    setErrors([error]);
                }
            } else {
                console.log("browser errors");
                // setMessages([]);
                setErrors(validationErrors);
            }
        }
    }

    const validUsername = USER_REGEX.test(username);
    const validPassword = PWD_REGEX.test(password);

    const errClass = errors.length ? "errmsg" : "offscreen";
    // const successMsgClass = messages.length ? "successmsg" : "offscreen";
    let validUserClass = "initial";
    let validPwdClass = "initial";
    // let validRolesClass = "initial";

    if (formSubmitedOnce.current && !isPending) {
        validUserClass = !validUsername ? "invalid" : "valid";
        // validUserClass = username.length < 3 ? "invalid" : "valid";
        validPwdClass = !validPassword ? "invalid" : "valid";
        // validPwdClass = password.length < 6 ? "invalid" : "valid";
        // validRolesClass = !Boolean(roles.length) ? "invalid" : "valid";
    }

    const content = (
        <section className="public">
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className="login">
                <div className="messages">
                    <div className={errClass}>
                        {errors.map((err, index) => {
                            return <p key={index}>{err.message}</p>
                        })}
                    </div>

                    {/* <div className={successMsgClass}>
                    {messages.map((message, index) => {
                        return <p key={index}>{message.message}</p>
                    })}
                </div> */}
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username" className="form-label">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        className={`form-input ${validUserClass}`}
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                    />

                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={`form-input ${validPwdClass}`}
                        value={password}
                        onChange={handlePwdInput}
                    />

                    <button className="submit-button">Sign In</button>

                    <label htmlFor="persist" className="form-persist">
                        <input
                            type="checkbox"
                            id="persist"
                            className="form-checkbox"
                            checked={persist}
                            onChange={handleToggle}
                        />
                        Trust This Device
                    </label>
                </form>
            </main>
            <LoginButtons setUsername={setUsername} setPassword={setPassword} />
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )

    return content;
}

// todelete
// ===========================================================================
function LoginButtons({setUsername, setPassword}) {
    function loginManager() {
        setUsername("Manager");
        setPassword("123Manager");
    }

    function loginAdmin() {
        setUsername("Admin");
        setPassword("123Admin");
    }

    function loginEmployee() {
        setUsername("Employee");
        setPassword("123Employee");
    }

    return (
        <div className="login-buttons">
            <button
                className="submit-button"
                onClick={loginManager}
            >
                Manager
            </button>
            <button
                className="submit-button"
                onClick={loginAdmin}
            >
                Admin
            </button>
            <button
                className="submit-button"
                onClick={loginEmployee}
            >
                Employee
            </button>
        </div>
    )
}
// ===========================================================================

export default CheckUserStatus;