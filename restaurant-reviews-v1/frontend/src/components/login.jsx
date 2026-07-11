import { useState } from "react";

const Login = () => {
    const initialUserState = {
        name: "",
        id: "",
    };

    const [user, setUser] = useState(initialUserState);

    return (
        <div className="submit-form">
            <div>
                <div className="form-group">
                    <label htmlFor="user">Username</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
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
                        required
                    />
                </div>

                <button className="btn">
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;