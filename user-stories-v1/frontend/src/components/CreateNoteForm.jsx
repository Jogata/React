import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const addNewNote = async (note, url = "http://localhost:5000/notes", token, setToken) => {
    console.log(token);
    try {
        // const res = await fetch(url, {
        //     method: "POST",
        //     headers: {
            //         "Content-Type": "application/json",
            //         "authorization": `Bearer ${token}`
        //     },
        //     body: JSON.stringify(note),
        // });
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(note),
        }
        
        const res = await customFetch(url, options, token, setToken);

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

// function useCustomFetch(token, setToken) {
    
    const customFetch = async (url, options = {}, token, setToken, navigate) => {
        // Defensive check: ensure options is an object
        // if (typeof options !== "object" || options === null) {
            //   options = {};
            // }
            console.log(token);
            
            options.headers = options.headers || {};
            // Ensure HttpOnly cookies travel cross-domain
            //   options.credentials = "include";
            
            // Inject the live token state into the outgoing header
            if (token) {
                options.headers["Authorization"] = `Bearer ${token}`;
            }
            
            // Execute original request
            let response = await fetch(url, options);
            
            // Catch 401 Unauthorized errors
            if (response.status === 401 && !options._retry) {
                options._retry = true;
                
                try {
                    // Hit the refresh endpoint (sends secure HttpOnly cookie)
                    const refreshRes = await fetch("http://localhost:5000/auth/refresh", {
                        method: "POST",
                        credentials: "include"
                    });
                    
                    if (refreshRes.ok) {
                        const data = await refreshRes.json();
                        
                        // Directly update the real React State!
                        setToken(data.accessToken);
                        // if (setUsername) {
              // setUsername(data.username);
              // localStorage.setItem("username", data.username);
              // }
              
              // Overwrite the backup header and retry
              options.headers["Authorization"] = `Bearer ${data.accessToken}`;
              response = await fetch(url, options);
            } else {
                handleLogout();
            }
        } catch (err) {
            console.error("Refresh crashed:", err);
            handleLogout(navigate);
        }
    }
    
      return response;
    };
    
    // Automated cleanup and redirect wrapper
    const handleLogout = (navigate) => {
        localStorage.removeItem("user");
        setToken(null);
        // if (setUsername) setUsername(null);
        
        navigate("/login", { replace: true }); 
    };
    
    // return customFetch;
    //   }  
    
    const CreateNoteForm = ({ users, token, setToken }) => {
        // const navigate = useNavigate();
        const navigate = useNavigate();
        
        // const [title, setTitle] = useState("");
        const [title, setTitle] = useState("test note 14");
        // const [text, setText] = useState("");
        const [text, setText] = useState("text for test note 14");
        const [userId, setUserId] = useState(users[0]._id);
        const [isPending, setIsPending] = useState(false);
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
        console.log(token);
        
        if (isPending) {
            setMessages["A new note is created in the moment"];
        }
        
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

        // const note = { user: userId, title, text };
        // const url = "http://localhost:5000/notes";
        
        // if (canSave) {
            if (validationErrors.length == 0) {
            const note = { userId, title, text };
            const url = "http://localhost:5000/notes";
            // console.log(note);
            setIsPending(true);
    
            const res = await addNewNote(note, url, token, setToken, navigate);
            // console.log(res);

            if (res.success) {
                setIsPending(false);
                setMessages([res.data.message]);
                setErrors([]);
                isFormSubmitted.current = false;
            } else {
                setIsPending(false);
                setMessages([]);
                setErrors([res.data.message]);
                // isFormSubmitted.current = true;
            }
        } else {
            setErrors(validationErrors);
            setMessages([]);
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

    let validTitleClass = "initial";
    let validTextClass = "initial";

    // if (isFormSubmitted.current) {
    if (isFormSubmitted.current && !isPending) {
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

            <div className="links">
                <Link to="/dash/notes" className="redirect-link">
                    Browse all notes
                </Link>
            </div>
        </>
    )

    return content;
}

export default CreateNoteForm;