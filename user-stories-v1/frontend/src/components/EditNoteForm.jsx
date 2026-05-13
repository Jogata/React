import { useState, useEffect } from "react";
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

    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [completed, setCompleted] = useState(note.completed);
    const [userId, setUserId] = useState(note.username);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [messages, setMessages] = useState([]);
    const [errors, setErrors] = useState([]);

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
        if (canSave) {
            // console.log(canSave);
            // console.log("updated started");
            // console.log(note._id);
            const res = await updateNote({ id: note._id, user: userId, title, text, completed });
            console.log(res);
            const json = await res.json();
            console.log(json);
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
                value={user.id}
            >
                {user.username}
            </option >
        )
    })

    // const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const errClass = isError ? "errmsg" : "offscreen";
    const successMsgClass = messages.length ? "successmsg" : "offscreen";
    const validTitleClass = !title ? "incomplete" : "";
    const validTextClass = !text ? "incomplete" : "";

    // const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

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
                        // console.log(message);
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
                    className={`form-input text ${validTextClass}`}
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
                    <div className="form-divider">
                        <p className="form-created">Created:<br />{created}</p>
                        <p className="form-updated">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )

    return content;
}

export default EditNoteForm;