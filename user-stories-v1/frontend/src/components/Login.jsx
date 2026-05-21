import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const userRef = useRef();
    // const ref = useRef(0);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    // useEffect(() => {
    //     console.log(ref.current);;
    // }, [ref.current])

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("form submitted");
        // ref.current++;
        const url = "http://localhost:5000/auth";

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

    // console.log(ref.current);

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
                        autoComplete="off"
                        // required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        // required
                    />

                    <button className="submit-button">Sign In</button>


                    <label htmlFor="persist" className="form-persist">
                        <input
                            type="checkbox"
                            id="persist"
                            className="form-checkbox"
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