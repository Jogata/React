import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

const CreatePage = () => {
    // const [title, setTitle] = useState("");
    const [title, setTitle] = useState("test note 1");
    // const [content, setContent] = useState("");
    const [content, setContent] = useState("test note 1 text");
    const [loading, setLoading] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();

    async function createNote(data) {
        const response = await fetch("http://localhost:5000/api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        console.log(response);

        const contentType = response.headers.get("content-type");
        let result = null;

        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            result = await response.text();
        }
        console.log(result);

        if (response.ok) {
            return result;
        } else {
            const errorMessage = result.message || "An error occurred during creation";
            throw new Error(errorMessage);
        }
    }

    async function handleSubmitCreateNoteForm(e) {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            // console.log("All fields are required");
            setNotifications(["All fields are required"]);
            return;
        }

        setLoading(true);

        try {
            // const response = await createNote({ title, content });
            const response = await createNote({ title, content });
            console.log(response);
            // TODO: update notes state
            setNotifications([`${response.title} was created`]);

            // navigate("/");
        } catch (error) {
            console.log("Error creating note", error);
            console.log("Failed to create note");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <Notifications notifications={notifications} />

            <Link to={"/"} className="link-btn alt">
                <i className="fa fa-angle-double-left" aria-hidden={true}></i>
                Back to Notes
            </Link>

            <div className="inner-section">
                <div className="form">
                    <h1 className="form-title" aria-labelledby="form-title">
                        Create New Note
                    </h1>

                    <form onSubmit={handleSubmitCreateNoteForm} aria-labelledby="form-title">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Note Title"
                                className="input input-bordered"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Content</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered"
                                placeholder="Write your note here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="card-actions">
                            <button type="submit" className="btn btn-primary">
                                {loading ? "Creating..." : "Create Note"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <GenerateButton setTitle={setTitle} setContent={setContent} />
        </div>
    );
};

function Notifications({ notifications }) {
    const popoverRef = useRef(null);

    useEffect(() => {
        const popoverNode = popoverRef.current;
        if (!popoverNode) return;

        if (notifications.length > 0) {
            popoverNode.showPopover();
        } else {
            popoverNode.hidePopover();
        }
    }, [notifications.length]);

    return (
        <div 
            className="toast-container" 
            ref={popoverRef} 
            popover="manual" 
            role="status"
        >
            {notifications.map(toast => (
                <h2>toast</h2>
            ))}
        </div>
    );
}

function GenerateButton({setTitle, setContent}) {
    const [ number, setNumber ] = useState(1);

    function generate() {
        const newNumber = number + 1;
        console.log(newNumber);
        setNumber(newNumber);
        setTitle(`test note ${newNumber}`);
        setContent(`test note ${newNumber} text`);
    }

    return (
        <button className="btn" onClick={generate}>
            GENERATE
        </button>
    )
}

export default CreatePage;