import { useState } from "react";
import { Link } from "react-router";
import { useNotify } from "../../context/NotificationProvider";
import { notesApi } from "../../services/notes";
import { useNotes } from "../../context/NotesProvider";

const CreatePage = () => {
    // const [title, setTitle] = useState("");
    const [title, setTitle] = useState("test note 1");
    // const [content, setContent] = useState("");
    const [content, setContent] = useState("test note 1 text");
    const [creating, setCreating] = useState(false);

    const { addNote } = useNotes();

    const { addNotification } = useNotify();

    // const navigate = useNavigate();

    // async function createNote(data) {
    //     const response = await fetch("http://localhost:5000/api/notes", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(data)
    //     });
    //     console.log(response);

    //     const contentType = response.headers.get("content-type");
    //     let result = null;

    //     if (contentType && contentType.includes("application/json")) {
    //         result = await response.json();
    //     } else {
    //         result = await response.text();
    //     }
    //     console.log(result);

    //     if (response.ok) {
    //         return result;
    //     } else {
    //         const errorMessage = result.message || "An error occurred during creation";
    //         throw new Error(errorMessage);
    //     }
    // }

    async function handleSubmitCreateNoteForm(e) {
        e.preventDefault();

        if (creating) {
            // console.log("A new note is currently being created.");
            addNotification("A new note is currently being created.", "success");
            return;
        }

        if (!title.trim() || !content.trim()) {
            // console.log("All fields are required");
            addNotification("All fields are required", "error");
            return;
        }

        setCreating(true);

        try {
            // const response = await createNote({ title, content });
            const response = await notesApi.createNote({ title, content });
            // console.log(response);
            // TODO: update notes state
            addNote(response);
            addNotification(`${response.title} was created`, "success");

            // navigate("/");
        } catch (error) {
            console.log("Error creating note", error);
            // console.log("Failed to create note");
            addNotification("Failed to create note", "error");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="section">

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
                                {creating ? "Creating..." : "Create Note"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <GenerateButton setTitle={setTitle} setContent={setContent} />
        </div>
    );
};

function GenerateButton({setTitle, setContent}) {
    const [ number, setNumber ] = useState(1);

    function generate() {
        const newNumber = number + 1;
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