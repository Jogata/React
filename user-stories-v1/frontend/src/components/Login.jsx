import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const url = "http://localhost:5000/auth";
const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{6,12}$/;

const Login = () => {
    // const [username, setUsername] = useState("");
    const [username, setUsername] = useState("user5");
    // const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass1235");
    const [persist, setPersist] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState([]);
    // const [messages, setMessages] = useState([]);
    const formSubmitedOnce = useRef(false);
    const userRef = useRef();

    const [tokens, setTokens] = useState({});
    console.log(tokens.accessToken);

    useEffect(() => {
        userRef.current.focus();
    }, [])


    const refresh = (e) => {
        e.preventDefault();
        const url = "http://localhost:5000/token";
        const tokentest = async () => {
            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: tokens.refreshToken }),
                });
    
                if (res.ok) {
                    const result = await res.json(res);
                    // console.log(result);
                    setTokens({...tokens, accessToken: result.accessToken});
                } else {
                    const result = await res.json(res);
                    console.log(result);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        tokentest();
    }

    const getposts = (e) => {
        e.preventDefault();
        const url = "http://localhost:5000/posts";
        const tokentest = async () => {
            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        // "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokens.accessToken}`
                    },
                    // body: JSON.stringify({ token: tokens.accessToken }),
                });
    
                if (res.ok) {
                    const result = await res.json(res);
                    console.log(result);
                    // setTokens({...tokens, accessToken: result.accessToken});
                } else {
                    const result = await res.json(res);
                    console.log("Error: ", result);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        tokentest();
    }

    const logout = (e) => {
        e.preventDefault();
        const url = "http://localhost:5000/logout";
        const tokentest = async () => {
            try {
                const res = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        // "Authorization": `Bearer ${tokens.accessToken}`
                    },
                    body: JSON.stringify({ token: tokens.refreshToken }),
                });
    
                if (res.ok) {
                    // const result = await res.json(res);
                    console.log(res.status);
                    // setTokens({...tokens, accessToken: result.accessToken});
                } else {
                    // const result = await res.json(res);
                    console.log("Error: ", res.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        tokentest();
    }

    useEffect(() => {
        const url = "http://localhost:5000/login";
        const logintest = async () => {
            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: "Kyle" }),
                });
    
                if (res.ok) {
                    const result = await res.json(res);
                    // console.log(result);
                    setTokens(result);
                } else {
                    const result = await res.json(res);
                    console.log(result);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        logintest();
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
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, password }),
                    });

                    const result = await res.json();
                    console.log(result);

                    if (res.ok) {
                        console.log("redirect");
                        setIsPending(false);
                        // setMessages([result]);
                        setErrors([]);
                        formSubmitedOnce.current = false;
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
                        // className="form-input"
                        className={`form-input ${validUserClass}`}
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                    // required
                    />

                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        // className="form-input"
                        className={`form-input ${validPwdClass}`}
                        value={password}
                        onChange={handlePwdInput}
                    // required
                    />

                    <button className="submit-button">Sign In</button>
                    <button 
                        className="submit-button"
                        onClick={refresh}
                    >
                        refresh token
                    </button>
                    <button 
                        className="submit-button"
                        onClick={getposts}
                    >
                        get post
                    </button>
                    <button 
                        className="submit-button"
                        onClick={logout}
                    >
                        logout
                    </button>

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
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )

    return content;
}

export default Login;