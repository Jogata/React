import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../config/roles";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

async function addNewUser(user, url = "http://localhost:5000/users") {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        const data = await res.json();

        return {
            success: res.ok,
            data
        };

    } catch (error) {0
        console.log(error);
    }
}

const CreateUserForm = () => {
    // const [username, setUsername] = useState("");
    const [username, setUsername] = useState("user6");
    // const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass1236");
    const [roles, setRoles] = useState(["Employee"]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const formSubmitedOnce = useRef(false);
    // let isLoading = false;
    console.log(isSuccess);

    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            // TOFIX
            setUsername("");
            setPassword("");
            setRoles(["Employee"]);
            // navigate("/dash/users");
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setRoles(values);
    }

    // const validUserClass = !validUsername ? "incomplete" : "complete";
    // const validRolesClass = !Boolean(roles.length) ? "incomplete" : "complete";
    const validUsername = USER_REGEX.test(username);
    const validPassword = PWD_REGEX.test(password);
    // console.log("password =", validPassword );
    // if (!validPassword) {
    //     setErrors(old => old.push({message: "fix password"}));
    // }
    
    // const errClass = isError ? "errmsg" : "offscreen";
    const errClass = errors.length ? "errmsg" : "offscreen";       //TODO
    const successMsgClass = messages.length ? "successmsg" : "offscreen";       //TODO
    let validUserClass = "initial";
    let validPwdClass = "initial";
    let validRolesClass = "initial";

    if (formSubmitedOnce.current) {
        validUserClass = !validUsername ? "invalid" : "valid";
        validPwdClass = !validPassword ? "invalid" : "valid";
        validRolesClass = !Boolean(roles.length) ? "invalid" : "valid";
    }

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
    // console.log(canSave, username);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        console.log("create user clicked");
        if (isLoading) {
            setErrors([{message: "A new user is created in the moment"}]);
        } else {
            formSubmitedOnce.current = true;

            if (canSave) {
                console.log("create new user req sended");
                setErrors([]);
                const res = await addNewUser({ username, password, roles });
                console.log(res);
                if (res.success) {
                    setIsSuccess(true);
                    setMessages([res.data]);
                    // setIsError(false);
                    formSubmitedOnce.current = false;
                    console.log(formSubmitedOnce.current);
                } else {
                    console.log("server errors");
                    // setIsError(true);
                    setIsSuccess(false);
                    setErrors([res.data]);
                }
            } else {
                console.log("fix the form");
                setMessages([]);
                setIsSuccess(false);
                const formErrors = [];
    
                if (!validUsername) {
                    // setErrors(old => {
                    //     console.log(old);
                    //     console.log("fix user");
                    //     const newerr = [...old];
                    //     newerr.push({message: "fix username"});
                    //     console.log("fix user aded");
                    //     console.log(newerr);
                    //     return newerr;
                    // });
                    formErrors.push({message: "fix username"});
                    console.log("fix username");
                }
    
                if (!validPassword) {
                    // setErrors(old => {
                        // console.log("fix password");
                    //     const newerr = [...old];
                    //     newerr.push({message: "fix password"});
                    //     console.log(newerr);
                    //     console.log("fix password added");
                    //     return newerr;
                    // });
                    formErrors.push({message: "fix password"});
                    console.log("fix password aded");
                }
    
                setErrors(formErrors);
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
                            // disabled={!canSave}
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
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
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
        </>
    )

    return content;
}

export default CreateUserForm;