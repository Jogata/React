import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Login = () => {
    const initialUserState = {
        name: "jogata",
        id: "bvhfh"
    };

    const { user, login } = useContext(UserContext);
    const [formInputs, setFormInputs] = useState(initialUserState);

    const navigate = useNavigate();

    if (user) {
        // console.log(user);
        const hasBrowserHistory = window.history.length > 2;
        if (hasBrowserHistory) {
            return <Navigate to="/" />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormInputs({ ...formInputs, [name]: value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        login(formInputs);
        const hasBrowserHistory = window.history.length > 2;
        if (hasBrowserHistory) {
            navigate(-1);
        } else {
            navigate("/", { replace: true });
        }
    };

    return (
        <>
            <form className="submit-form" onSubmit={handleLogin}>
                <div>
                    <h1>Login</h1>
                    <div className="form-group">
                        <label htmlFor="user">Username</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={formInputs.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="id">ID</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            className="form-control"
                            value={formInputs.id}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button className="btn btn-primary">
                        Login
                    </button>
                </div>
            </form>
            <Buttons setUser={setFormInputs} />
        </>
    );
};

function Buttons({ setUser }) {
    const user1 = {
        name: "jogata",
        id: "bvhfh"
    }

    const user2 = {
        name: "jogata2",
        id: "id2"
    }

    return (
        <div className="buttons">
            <button
                className="btn btn-primary"
                onClick={() => setUser(user1)}>
                user1
            </button>
            <button
                className="btn btn-primary"
                onClick={() => setUser(user2)}>
                user2
            </button>
        </div>
    )
}

export default Login;