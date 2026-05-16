import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:5000/notes";

const deleteNote = async (body) => {
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return res;

    } catch (error) {
        console.log(error);
    }
}

const updateNote = async (body) => {
    try {
        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return res;

    } catch (error) {
        console.log(error);
    }
}

const EditNoteForm = ({ note, users }) => {
    const {
        isLoading,
        // isSuccess,
        // isError,
        // error,
        // messages
    } = {
        isLoading: false, 
        // isSuccess: false,
        // isError: false, 
        // error: {},
        // messages: []
    }

    const {
        // isSuccess: isDelSuccess,
        // isError: isDelError,
        // error: delerror
    } = {
        // isSuccess: false,
        // isError: false, 
        // error: {}
    }

    const navigate = useNavigate();
    // console.log(note);

    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [completed, setCompleted] = useState(note.completed);
    const [userId, setUserId] = useState(note.user);
    // const [userId, setUserId] = useState("5");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [messages, setMessages] = useState([]);
    const [errors, setErrors] = useState([]);
    const isFormSubmitted = useRef(false);

    useEffect(() => {
        // if (isSuccess || isDelSuccess) {
        if (isSuccess) {
            // setTitle("");
            // setText("");
            // setUserId("");
            // navigate("/dash/notes");
        }

    // }, [isSuccess, isDelSuccess, navigate])
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value);
    const onTextChanged = e => setText(e.target.value);
    const onCompletedChanged = e => setCompleted(prev => !prev);
    const onUserIdChanged = e => setUserId(e.target.value);

    const canSave = [title, text, userId].every(Boolean) && !isLoading;
    // console.log(title, text, userId, isLoading);

    const onSaveNoteClicked = async () => {
        // console.log(canSave);
        isFormSubmitted.current = true;
        // console.log(canSave);
        const validationErrors = [];

        if (title.length == 0) {
            validationErrors.push("Each note must have a title");
        } else if (title.length <= 2) {
            validationErrors.push("The title of a note must be atleast 3 characters");
        }

        if (text.length == 0) {
            validationErrors.push("Each note must have a text description");
        } else if (text.length <= 2) {
            validationErrors.push("The text description of a note must be atleast 3 characters");
        }

        // if (canSave) {
        if (validationErrors.length == 0) {
            // console.log(canSave);
            // console.log("updated started");
            // console.log(note._id);
            // console.log(userId);
            try {
                const res = await updateNote({ id: note._id, user: userId, title, text, completed });
                console.log(res);
                const json = await res.json();
                console.log(json);
    
                if (res.ok) {
                    setMessages([json]);
                    setErrors([]);
                    isFormSubmitted.current = false;
                } else {
                    setMessages([]);
                    setErrors([json]);
                }                
            } catch (error) {
                console.log(error);
            }
        } else {
            setErrors(validationErrors);
            setMessages([]);
        }
    }

    const onDeleteNoteClicked = async () => {
        try {
            const res = await deleteNote({ id: note._id });
            console.log(res);

            if (res.status) {
                const result = await res.json();
                // console.log(result);
        
                if (res.ok) {
                    setIsSuccess(true);
                    setIsError(false);
                    setMessages([result]);
                    setErrors([]);
                } else {
                    // console.log(result.data.message);
                    setIsSuccess(false);
                    setIsError(true);
                    setMessages([]);
                    setErrors([result]);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    const created = new Date(note.createdAt)
        .toLocaleString("en-US", { 
            day: "numeric", 
            month: "long", 
            year: "numeric", 
            hour: "numeric", 
            minute: "numeric", 
            second: "numeric" 
        })

    const updated = new Date(note.updatedAt)
        .toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        })

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

    // const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const errClass = errors.length ? "errmsg" : "offscreen";
    const successMsgClass = messages.length ? "successmsg" : "offscreen";
    // const validTitleClass = !title ? "incomplete" : "";
    // const validTextClass = !text ? "incomplete" : "";
    let validTitleClass = "initial";
    let validTextClass = "initial";

    if (isFormSubmitted.current) {
        validTitleClass = title.length <= 2 ? "invalid" : "valid";
        validTextClass = text.length <= 2 ? "invalid" : "valid";
    }

    // const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    const content = (
        <>
            <div className="messages">
                <div className={errClass}>
                    {errors.map((err, index) => {
                        console.log(err);
                        return <p key={index}>{err.message}</p>
                    })}
                </div>

                <div className={successMsgClass}>
                    {messages.map((message, index) => {
                        console.log(message);
                        return <p key={index}>{message.message}</p>
                    })}
                </div>
            </div>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form-header">
                    <h2>Edit Note #{note.ticket}</h2>
                    <div className="form-action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveNoteClicked}
                        >
                            save changes
                            <i className="fa fa-floppy-o"></i>
                        </button>
                        <button
                            className="icon-button delete-btn"
                            title="Delete"
                            onClick={onDeleteNoteClicked}
                        >
                            delete note
                            <i className="fa fa-trash-o"></i>
                        </button>
                    </div>
                </div>

                <label className="form-label" htmlFor="note-title">
                    Title:
                </label>
                <input
                    className={`form-input ${validTitleClass}`}
                    id="note-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form-label" htmlFor="note-text">
                    Text:
                </label>
                <textarea
                    className={`form-input textarea ${validTextClass}`}
                    id="note-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <div className="form-row">
                    <div className="form-divider">
                        <label 
                            className="form-label form-checkbox-container" 
                            htmlFor="note-completed"
                        >
                            WORK COMPLETE:
                            <input
                                className="form-checkbox"
                                id="note-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>

                        <label 
                            className="form-label form-checkbox-container" 
                            htmlFor="note-username"
                        >
                            ASSIGNED TO:
                        </label>
                        <select
                            id="note-username"
                            name="username"
                            className="form-select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <dl className="form-divider">
                        {/* <p className="form-created">Created:<br />{created}</p> */}
                        <dt className="form-created">Created:</dt>
                        <dd>{created}</dd>
                        {/* <p className="form-updated">Updated:<br />{updated}</p> */}
                        <dt className="form-updated">Updated:</dt>
                        <dd>{updated}</dd>
                    </dl>
                </div>
            </form>
        </>
    )

    return content;
}

export default EditNoteForm;