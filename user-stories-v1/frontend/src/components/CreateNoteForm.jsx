import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

const addNewNote = async (note, url = "http://localhost:5000/notes") => {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });

        // return res;

        const data = await res.json();
        // console.log(data);

        if (res.ok) {
            return { success: true, data };
        } else {
            return {success: false, data};
        }

    } catch (error) {
        console.log(error);
        // return error;
    }
}

const CreateNoteForm = ({ users }) => {
    // const navigate = useNavigate();

    // const [title, setTitle] = useState("");
    const [title, setTitle] = useState("test note 13");
    // const [text, setText] = useState("");
    const [text, setText] = useState("text for test note 14");
    const [userId, setUserId] = useState(users[0]._id);
    const [isLoading, setIsLoading] = useState(false);    // TOFIX
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const isFormSubmitted = useRef(false);

    useEffect(() => {
        // TOFIX
        // if (isSuccess) {
            // console.log("start reset form", messages.length);
        if (messages.length) {
            // console.log("reset form");
            setTitle("");
            setText("");
            setUserId(users[0]._id);
            // navigate("/dash/notes");
        }
    // }, [isSuccess, navigate])
    // }, [messages, navigate])
    }, [messages])

    const onTitleChanged = e => setTitle(e.target.value);
    const onTextChanged = e => setText(e.target.value);
    const onUserIdChanged = e => setUserId(e.target.value);

    // const canSave = [title.length > 4, text.length > 4, userId].every(Boolean) && !isLoading;

    const onSaveNoteClicked = async (e) => {
        e.preventDefault();
        isFormSubmitted.current = true;
        // console.log(canSave);
        const validationErrors = [];

        if (title.length == 0) {
            validationErrors.push("Each note must have a title");
        }

        if (title.length <= 2) {
            validationErrors.push("The title of a note must be atleast 3 characters");
        }

        if (text.length == 0) {
            validationErrors.push("Each note must have a text description");
        }

        if (text.length <= 2) {
            validationErrors.push("The text description of a note must be atleast 3 characters");
        }

        // const note = { user: userId, title, text };
        // const url = "http://localhost:5000/notes";

        // if (canSave) {
        if (validationErrors.length == 0) {
            const note = { user: userId, title, text };
            const url = "http://localhost:5000/notes";
    
            const res = await addNewNote(note, url);
            // console.log(res);

            if (res.success) {
                setIsLoading(false);
                setMessages([res.data.message]);
                setErrors([]);
                isFormSubmitted.current = false;
            } else {
                setIsLoading(false);
                setMessages([]);
                setErrors([res.data.message]);
                // isFormSubmitted.current = true;
            }
        } else {
            // console.log("user must fix the form data");
            // isFormSubmitted.current = true;
            // const validationErrors = [];
            // if (title.length == 0) {
            //     validationErrors.push("Each note must have a title");
            // }

            // if (title.length <= 2) {
            //     validationErrors.push("The title of a note must be atleast 3 characters");
            // }

            // if (text.length == 0) {
            //     validationErrors.push("Each note must have a text description");
            // }

            // if (text.length <= 2) {
            //     validationErrors.push("The text description of a note must be atleast 3 characters");
            // }

            // setErrors(["All fields are required"]);
            setErrors(validationErrors);
        }
    }

    const options = users.map(user => {
        return (
            <option
                key={user._id}
                value={user._id}
            >
                {user.username}
            </option >
        )
    })

    const errClass = errors.length ? "errmsg" : "offscreen";
    const messagesClass = messages.length ? "successmsg" : "offscreen";
    // const validTitleClass = !title ? "invalid" : "valid";
    // const validTextClass = !text ? "invalid" : "valid";

    let validTitleClass = "initial";
    let validTextClass = "initial";

    if (isFormSubmitted.current) {
        validTitleClass = title.length <= 2 ? "invalid" : "valid";
        validTextClass = text.length <= 2 ? "invalid" : "valid";
    }

    const content = (
        <>
            <div className="messages">
                <div className={errClass}>
                    {errors.map((err, index) => {
                        return (
                            <p key={index}>{err}</p>
                        )
                    })}
                </div>
                <div className={messagesClass}>
                    {messages.map((message, index) => {
                        return (
                            <p key={index}>{message}</p>
                        )
                    })}
                </div>
            </div>

            <form className="form" onSubmit={onSaveNoteClicked}>
                <div className="form-header">
                    <h2>New Note</h2>
                    <div className="form-action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                        >
                            save new note
                            <i className="fa fa-floppy-o"></i>
                        </button>
                    </div>
                </div>

                <label className="form-label" htmlFor="title">
                    Title:
                </label>
                <input
                    className={`form-input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form-label" htmlFor="text">
                    Text:
                </label>
                <textarea
                    className={`form-input textarea ${validTextClass}`}
                    id="text"
                    name="text"
                    rows="5"
                    value={text}
                    onChange={onTextChanged}
                />

                <label className="form-label" htmlFor="username">
                    ASSIGNED TO:
                </label>
                <select
                    id="username"
                    name="username"
                    className="form-select"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content;
}

export default CreateNoteForm;