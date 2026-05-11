import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:5000/notes";

const deleteNote = async (body) => {
    // console.log("deleteNote req sended");
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        const result = {
            data, 
            success: res.ok
        };
        
        // if (res.ok) {
            // result.success = res.ok;
            // result.data = data;
            // console.log("ok", data);
            // navigate("/dash/users");
        // } else {
            // result.success = res.ok;
            // console.log(res.status, data);
            // console.log(data);
            // result.data = data;
        // }

        return result;

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
        messages
    } = {
        isLoading: true, 
        // isSuccess: false,
        // isError: false, 
        // error: {},
        messages: []
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

    const onSaveNoteClicked = async (e) => {
        if (canSave) {
            await updateNote({ id: note.id, user: userId, title, text, completed });
        }
    }

    const onDeleteNoteClicked = async () => {
        // console.log("delete note clicked");
        const result = await deleteNote({ id: note.id });
        // console.log(result);
        if (result.success) {
            setIsSuccess(true);
            setIsError(false);
            setErrors([]);
        } else {
            // console.log(result.data.message);
            setIsSuccess(false);
            setIsError(true);
            setErrors([result.data]);
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

    const deleteButton = (
        <button
            className="icon-button"
            title="Delete"
            onClick={onDeleteNoteClicked}
        >
            delete note
            <i className="fa fa-trash-o"></i>
        </button>
    )

    const content = (
        <>
            {/* <p className={errClass}>{errContent}</p> */}
            <div className="messages">
                <div className={errClass}>
                    {errors.map((err, index) => {
                        // console.log(err);
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
                <div className="form-title-row">
                    <h2>Edit Note #{note.ticket}</h2>
                    <div className="form-action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveNoteClicked}
                            // disabled={!canSave}
                        >
                            save changes
                            <i className="fa fa-floppy-o"></i>
                        </button>
                        {deleteButton}
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
                        <label className="form-label form-checkbox-container" htmlFor="note-completed">
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

                        <label className="form-label form-checkbox-container" htmlFor="note-username">
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