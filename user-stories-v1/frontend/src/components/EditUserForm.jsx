import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLES } from "../config/roles";

const url = "http://localhost:5000/users";
const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
    const [username, setUsername] = useState(user.username);
    // const [username, setUsername] = useState("too long username - the input has to pulse");
    const [password, setPassword] = useState("");
    // const [password, setPassword] = useState("invalid password - the input has to pulse");
    const [roles, setRoles] = useState(user.roles);
    // const [roles, setRoles] = useState([]);
    const [active, setActive] = useState(user.active);
    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const formSubmitedOnce = useRef(false);

    const navigate = useNavigate();

    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = {
        isLoading: false, 
        isSuccess: false, 
        isError: false, 
        error: ""
    }

    const {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    } = {
        isSuccess: false, 
        isError: false, 
        error: ""
    }

    const updateUser = async (user) => {
        try {
            const res = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
    
            const data = await res.json();
            console.log(data);

        } catch (error) {
            console.log(error);
        }
    }
    
    const deleteUser = async () => {
        // console.log("deleteUser");
        try {
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id: user._id}),
            });

            // const data = await res.json();
            
            // if (res.ok) {
            //     console.log(data);
            //     navigate("/dash/users");
            // } else {
            //     console.log(data);
            // }

            return res;

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            // TOFIX
            setUsername("");
            setPassword("");
            setRoles([]);
            // navigate("/dash/users");
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values);
    }

    const onActiveChanged = () => setActive(prev => !prev);

    const onSaveUserClicked = async () => {
        if (password) {
            await updateUser({ id: user._id, username, password, roles, active });
        } else {
            await updateUser({ id: user._id, username, roles, active });
        }
    }

    const onDeleteUserClicked = async () => {
        try {
            const res = await deleteUser({ id: user._id });
            console.log(res);
            const result = await res.json();
            if (res.ok) {
                console.log("todo redirect to all users");
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            >
                {role}
            </option >
        )
    })

    let canSave;
    const validUsername = USER_REGEX.test(username);
    const validPassword = PWD_REGEX.test(password);

    // const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const errClass = errors.length > 0 ? "errmsg" : "offscreen";
    const successMsgClass = messages.length > 0 ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? "invalid" : "valid";
    const validRolesClass = !Boolean(roles.length) ? "invalid" : "valid";
    let validPwdClass = "not-included";

    if (password) {
        validPwdClass = !validPassword ? "invalid" : "valid";
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
    }

    // const errContent = (error?.message || delerror?.message) ?? "";

    const content = (
        <>
            {/* <p className={errClass}>{errContent}</p> */}
            <div className="messages">
                <div className={errClass}>
                    {errors.map((err, index) => {
                        return <p key={index}>{err.message}</p>
                    })}
                </div>

                <div className={successMsgClass}>
                    {messages.map((message, index) => {
                        return <p key={index}>{message.message}</p>
                    })}
                </div>
            </div>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form-header">
                    <h2>Edit User</h2>
                    <div className="form-action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                        >
                            save changes
                            <i className="fa fa-floppy-o"></i>
                        </button>
                        <button
                            className="icon-button delete-btn"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <i className="fa fa-trash-o"></i>
                        </button>
                    </div>
                </div>
                <label className="form-label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form-input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form-label" htmlFor="password">
                    Password: 
                    <span className="nowrap">[empty = no change]</span> 
                    <span className="nowrap">[4-12 chars incl. !@#$%]</span>
                </label>
                <input
                    className={`form-input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form-label" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form-checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>

                <label className="form-label" htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={`form-select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>

            </form>

            <div className="links">
                <Link to="/dash/users" className="redirect-link">
                    Browse all users
                </Link>
            </div>
        </>
    )

    return content;
}

export default EditUserForm;