import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const addNewNote = async (note, url = "http://localhost:5000/notes") => {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });

        const data = await res.json();
        console.log(data);

        // return data;

        if (res.ok) {
            return { success: true, data };
        } else {
            return {success: false, data};
        }

        // return {
        //     success: res.ok,
        //     data
        // };

    } catch (error) {
        console.log(error);
        // return error;
    }
}

const CreateNoteForm = ({ users }) => {
    const {
        // isLoading,
        // isSuccess,
        // isError,
        // error
    } = {
        // isLoading: false,
        // isSuccess: false,
        // isError: false,
        // error: []
    }

    const navigate = useNavigate();

    // const [title, setTitle] = useState("");
    const [title, setTitle] = useState("test note 11");
    // const [text, setText] = useState("");
    const [text, setText] = useState("text for test note 11");
    const [userId, setUserId] = useState(users[0]._id);
    // const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);    // TOFIX
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // TOFIX
        // if (isSuccess) {
            console.log("start reset form", messages.length);
        if (messages.length) {
            console.log("reset form");
            setTitle("");
            setText("");
            setUserId(users[0]._id);
            // navigate("/dash/notes");
        }
    // }, [isSuccess, navigate])
    }, [messages, navigate])

    const onTitleChanged = e => setTitle(e.target.value);
    const onTextChanged = e => setText(e.target.value);
    const onUserIdChanged = e => setUserId(e.target.value);

    const canSave = [title, text, userId].every(Boolean) && !isLoading;
    // console.log(title, text, userId, canSave);

    const onSaveNoteClicked = async (e) => {
        e.preventDefault();
        // console.log("submitted");
        if (canSave) {
            // console.log("submitted");
            const res = await addNewNote({ user: userId, title, text });
            if (res.success) {
                console.log("if success", res);
                setIsLoading(false);
                // setIsSuccess(true);
                setMessages([res.data.message]);
                setErrors([]);
            } else {
                console.log("else fail", res);
                setIsLoading(false);
                // setIsSuccess(false);
                setMessages([]);
                setErrors([res.data.message]);
            }
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

    // const errClass = isError ? "errmsg" : "offscreen";
    const errClass = errors.length ? "errmsg" : "offscreen";
    const messagesClass = messages.length ? "successmsg" : "offscreen";
    const validTitleClass = !title ? "invalid" : "valid";
    const validTextClass = !text ? "invalid" : "valid";

    const content = (
        <>
            <div className="messages">
                {/* <p className={errClass}>{error?.data?.message}</p> */}
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
                            // disabled={!canSave}
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