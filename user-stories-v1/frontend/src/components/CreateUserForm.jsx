import { useState, useEffect, useRef } from "react";
import { ROLES } from "../config/roles";
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{6,12}$/;

async function addNewUser(user, url = "http://localhost:5000/users") {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        // throw new Error("test");
            
        return res;

    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

const CreateUserForm = () => {
    // const [username, setUsername] = useState("");
    const [username, setUsername] = useState("user5");
    // const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass1235");
    const [roles, setRoles] = useState(["Employee"]);
    const [isSuccess, setIsSuccess] = useState(false);    // TOFIX
    const [isLoading, setIsLoading] = useState(false);    // TOFIX
    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const formSubmitedOnce = useRef(false);

    useEffect(() => {
        if (messages.length > 0) {
            setUsername("");
            setPassword("");
            setRoles(["Employee"]);
        }
    }, [messages])

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setRoles(values);
    }

    const validUsername = USER_REGEX.test(username);
    const validPassword = PWD_REGEX.test(password);

    const errClass = errors.length ? "errmsg" : "offscreen";
    const successMsgClass = messages.length ? "successmsg" : "offscreen";
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

    const onSaveUserClicked = async (e) => {
        e.preventDefault();

        const validationErrors = [];

        if (username.length == 0) {
            validationErrors.push({
                message: "Each user must have a name"
            });
        } else if (username.length < 3) {
            validationErrors.push({
                message: "The name of the user must be atleast 3 characters"
            });
        }
        
        if (!USER_REGEX.test(username)) {
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
        }
        
        if (!PWD_REGEX.test(password)) {
            validationErrors.push({
                message: "The password contains inappropriate symbols"
            });
        }

        if (isPending) {
            setErrors([{message: "A new user is being created right now"}]);
        } else {
            formSubmitedOnce.current = true;

            if (validationErrors.length == 0) {
                try {
                    setIsPending(true);

                    const res = await addNewUser({ username, password, roles });
                    const result = await res.json();
    
                    if (res.ok) {
                        setIsPending(false);
                        setMessages([result]);
                        setErrors([]);
                        formSubmitedOnce.current = false;
                    } else {
                        console.log("server errors", result);
                        setIsPending(false);
                        setMessages([]);
                        setErrors([result]);
                        // formSubmitedOnce.current = false;
                    }
                } catch (error) {
                    console.log(error.message);
                    formSubmitedOnce.current = false;
                    setIsPending(false);
                    setMessages([]);
                    setErrors([error]);
                }
            } else {
                console.log("browser errors");
                setMessages([]);
                setErrors(validationErrors);
            }
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

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form-header">
                    <h2>New User</h2>
                    <div className="form-action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                        >
                            save new user
                            <i className="fa fa-floppy-o"></i>
                        </button>
                    </div>
                </div>

                <label htmlFor="username" className="form-label">
                    Username: <span className="nowrap">[3-20 letters]</span>
                </label>
                <input
                    className={`form-input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label htmlFor="password" className="form-label">
                    Password: <span className="nowrap">[6-12 chars incl. !@#$%]</span>
                </label>
                <input
                    className={`form-input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label htmlFor="roles" className="form-label">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={`form-select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    defaultValue={roles}
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

export default CreateUserForm;