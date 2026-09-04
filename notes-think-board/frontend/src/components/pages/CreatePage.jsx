import { useState } from "react";
import { Link, useNavigate } from "react-router";

const CreatePage = () => {
    // const [title, setTitle] = useState("");
    const [title, setTitle] = useState("test note 12");
    // const [content, setContent] = useState("");
    const [content, setContent] = useState("test note 12 text");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            console.log("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/notes", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, content })
            });

            console.log(response);

            navigate("/");
        } catch (error) {
            console.log("Error creating note", error);
            console.log("Failed to create note");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <div>
                    <Link to={"/"}>
                        Back to Notes
                    </Link>

                    <div>
                        <div className="card-body">
                            <h2 className="card-title">Create New Note</h2>
                            <form onSubmit={handleSubmit}>
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
                </div>
            </div>
        </div>
    );
};

export default CreatePage;