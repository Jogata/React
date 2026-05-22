import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const url = "http://localhost:5000/auth";
const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{6,12}$/;

const Login = () => {
    // const [username, setUsername] = useState("");
    const [username, setUsername] = useState("user1");
    // const [password, setPassword] = useState("");
    const [password, setPassword] = useState("123test1");
    const [persist, setPersist] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState([]);
    // const [messages, setMessages] = useState([]);
    const formSubmitedOnce = useRef(false);
    const userRef = useRef();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist(prev => !prev);

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log("form submitted");

        // const url = "http://localhost:5000/auth";

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
        const result = await res.text();
        console.log(result);
    }

    const validUsername = USER_REGEX.test(username);
    const validPassword = PWD_REGEX.test(password);

    const errClass = errors.length ? "errmsg" : "offscreen";
    // const successMsgClass = messages.length ? "successmsg" : "offscreen";
    let validUserClass = "initial";
    let validPwdClass = "initial";
    let validRolesClass = "initial";

    if (formSubmitedOnce.current && !isPending) {
        validUserClass = !validUsername ? "invalid" : "valid";
        // validUserClass = username.length < 3 ? "invalid" : "valid";
        validPwdClass = !validPassword ? "invalid" : "valid";
        // validPwdClass = password.length < 6 ? "invalid" : "valid";
        validRolesClass = !Boolean(roles.length) ? "invalid" : "valid";
    }

    const content = (
        <section className="public">
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className="login">
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        className="form-input"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        // required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={password}
                        onChange={handlePwdInput}
                        // required
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
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )

    return (
        <>
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
            {content}
        </>
    );
}

export default Login;