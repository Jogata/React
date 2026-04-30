import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const CreateUserForm = () => {
    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(true);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(true);
    const [roles, setRoles] = useState(["Employee"]);
    let isSuccess = false;
    let isError = false;
    let error = {};
    let isLoading = false;

    const navigate = useNavigate();

    useEffect(() => {
        console.log("useeffect1");
        setValidUsername(USER_REGEX.test(username));
    }, [username])
    
    useEffect(() => {
        console.log("useeffect2");
        setValidPassword(PWD_REGEX.test(password));
    }, [password])
    
    useEffect(() => {
        console.log("useeffect3");
        if (isSuccess) {
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

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
    // const canSave = [roles.length, validUsername, validPassword].every(Boolean);
    // console.log([roles.length, validUsername, validPassword]);
    // console.log(canSave);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewUser({ username, password, roles });
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? "incomplete" : "complete";
    const validPwdClass = !validPassword ? "incomplete" : "complete";
    const validRolesClass = !Boolean(roles.length) ? "incomplete" : "complete";

    const content = (
        <>
            <p className={errClass}>{error.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form-header">
                    <h2>New User</h2>
                    <div className="form-action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
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
                    value={roles}
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