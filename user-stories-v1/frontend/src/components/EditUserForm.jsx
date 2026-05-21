import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLES } from "../config/roles";

const url = "http://localhost:5000/users";
const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const updateUser = async (user) => {
    try {
        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        return res;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

const deleteUser = async ({id}) => {
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id}),
        });

        return res;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

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

    // const {
        // isLoading,
        // isSuccess,
        // isError,
        // error
    // } = {
        // isLoading: false, 
        // isSuccess: false, 
        // isError: false, 
        // error: ""
    // }

    // const {
    //     isSuccess: isDelSuccess,
    //     isError: isDelError,
    //     error: delerror
    // } = {
    //     isSuccess: false, 
    //     isError: false, 
    //     error: ""
    // }

    // useEffect(() => {
        // if (isSuccess || isDelSuccess) {
            // TOFIX
            // setUsername("");
            // setPassword("");
            // setRoles([]);
            // navigate("/dash/users");
        // }

    // }, [isSuccess, isDelSuccess, navigate])

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
        // setIsPending(true);
        // if (password) {
        //     await updateUser({ id: user._id, username, password, roles, active });
        // } else {
        //     await updateUser({ id: user._id, username, roles, active });
        // }
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

        if (password.length > 0) {
            if (password.length < 6) {
                validationErrors.push({
                    message: "The password must be atleast 6 characters"
                });
            } else if (!PWD_REGEX.test(password)) {
                validationErrors.push({
                    message: "The password contains inappropriate symbols"
                });
            }
        }

        if (isPending) {
            setErrors([{ message: "A user is being updated right now" }]);
        } else {
            formSubmitedOnce.current = true;

            if (validationErrors.length == 0) {
                try {
                    setIsPending(true);

                    const res = await updateUser({ id: user._id, username, password, roles, active });
                    const result = await res.json();

                    if (res.ok) {
                        setIsPending(false);
                        setMessages([result]);
                        setErrors([]);
                        formSubmitedOnce.current = false;
                    } else {
                        // console.log("server errors", result);
                        setIsPending(false);
                        setMessages([]);
                        setErrors([result]);
                        // formSubmitedOnce.current = false;
                    }
                } catch (error) {
                    // console.log(error.message);
                    setIsPending(false);
                    setMessages([]);
                    setErrors([error]);
                    formSubmitedOnce.current = false;
                }
            } else {
                console.log("browser errors");
                setMessages([]);
                setErrors(validationErrors);
            }
        }
    }

    const onDeleteUserClicked = async () => {
        try {
            setIsPending(true);
            const res = await deleteUser({ id: user._id });

            const result = await res.json();

            if (res.ok) {
                navigate("/dash/users", {
                    state: {message: result.message}
                })
            } else {
                console.log("server errors");
                setIsPending(false);
                setMessages([]);
                setErrors([result]);
            }
        } catch (error) {
            console.log(error);
            setErrors([{message: error.message}]);
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

    // let canSave;
    // const validUsername = USER_REGEX.test(username);
    // const validPassword = PWD_REGEX.test(password);

    // const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const errClass = errors.length > 0 ? "errmsg" : "offscreen";
    const successMsgClass = messages.length > 0 ? "successmsg" : "offscreen";
    // const validUserClass = !validUsername ? "invalid" : "valid";
    // const validRolesClass = !Boolean(roles.length) ? "invalid" : "valid";
    let validUserClass = "initial";
    let validPwdClass = "not-included";
    let validRolesClass = "initial";

    if (formSubmitedOnce.current && !isPending) {
        const validUsername = USER_REGEX.test(username);
        validUserClass = !validUsername ? "invalid" : "valid";

        if (password) {
            const validPassword = PWD_REGEX.test(password);
            validPwdClass = !validPassword ? "invalid" : "valid";
        }

        validRolesClass = !Boolean(roles.length) ? "invalid" : "valid";
    }

    const content = (
        <>
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