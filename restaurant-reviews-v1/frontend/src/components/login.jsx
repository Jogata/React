import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ login }) => {
    const initialUserState = {
        name: "jogata",
        id: "bvhfh",
    };

    const [user, setUser] = useState(initialUserState);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        login(user);
        navigate("/");
      };

    return (
        <form className="submit-form" onSubmit={handleLogin}>
            <div>
                <div className="form-group">
                    <label htmlFor="user">Username</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={user.name}
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
                        value={user.id}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button className="btn">
                    Login
                </button>
            </div>
        </form>
    );
};

export default Login;