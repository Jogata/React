import { useState, useEffect } from "react";
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
    const [username, setUsername] = useState("user 4");
    // const [validUsername, setValidUsername] = useState(true);
    // const [password, setPassword] = useState("");
    const [password, setPassword] = useState("pass 1234");
    // const [validPassword, setValidPassword] = useState(true);
    const [roles, setRoles] = useState(["Employee"]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState([]);
    let isLoading = false;

    const navigate = useNavigate();

    // useEffect(() => {
    //     setValidUsername(USER_REGEX.test(username));
    // }, [username])

    // useEffect(() => {
    //     setValidPassword(PWD_REGEX.test(password));
    // }, [password])

    // useEffect(() => {
    //     console.log("useEffect");
    //     return () => setErrors([]);
    // }, [errors.length])

    useEffect(() => {
        if (isSuccess) {
            // TOFIX
            setUsername("");
            setPassword("");
            setRoles([]);
            navigate("/dash/users");
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
    
    const errClass = isError ? "errmsg" : "offscreen";       //TODO
    const validUserClass = !validUsername ? "invalid" : "valid";
    const validPwdClass = !validPassword ? "invalid" : "valid";
    const validRolesClass = !Boolean(roles.length) ? "invalid" : "valid";

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
    // console.log(canSave, username);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        console.log("create user clicked");
        if (canSave) {
            console.log("create new user req sended");
            const res = await addNewUser({ username, password, roles });
            console.log(res);
            if (res.success) {
                setIsSuccess(true);
                setIsError(false);
            } else {
                setIsError(true);
                setErrors([res.data]);
            }
        } else {
            console.log("fix the form");
            if (!validUsername) {
                setErrors(old => {
                    // console.log(old);
                    // console.log("fix user");
                    const newerr = [...old];
                    newerr.push({message: "fix username"});
                    console.log("fix user aded");
                    console.log(newerr);
                    return newerr;
                });
            }
            if (!validPassword) {
                setErrors(old => {
                    // console.log("fix password");
                    const newerr = [...old];
                    newerr.push({message: "fix password"});
                    console.log(newerr);
                    console.log("fix password added");
                    return newerr;
                });
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
            {/* <p className={errClass}>{error.message}</p> */}
            <div className={errClass}>
                {errors.map((err, index) => {
                    return <p key={index}>{err.message}</p>
                })}
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