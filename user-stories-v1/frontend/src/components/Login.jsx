import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const userRef = useRef();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    function handleSubmit() {
        e.preventDefault();
        console.log("form submitted");
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
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        required
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