import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";


const CreateBook = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publishYear, setPublishYear] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const controller = useRef(null);

    const handleSaveBook = (e) => {
        e.preventDefault();
        try {
            const data = {
                title,
                author,
                publishYear,
            };

            data.title = "test title 3";
            data.author = "test author 3";
            data.publishYear = 2003;

            if (controller.current) {
                controller.current.abort();
                controller.current = null;
            }

            if (
                !data.title ||
                !data.author ||
                !data.publishYear
            ) {
                return {
                    message: "Send all required fields: title, author, publishYear",
                }
            }
            
            setLoading(true);

            controller.current = new AbortController();

            fetch("http://localhost:5555/books", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                  },
                signal: controller.current.signal,
            })
                .then(res => res.json())
                .then(() => {
                    controller.current = null;
                    navigate("/");
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        console.log("Fetch request was canceled");
                    } else {
                        console.error("Fetch error:", error);
                    }
                })
                .finally(() => {
                    if (!controller.current) {
                        setLoading(false);
                    }
                });                
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
            if (controller.current) {
                controller.current.abort();
            }
        };
    }, [controller])

    return (
        <div className="create-page">
            <BackButton />
            <h1>Create Book</h1>
            {loading ? <Spinner /> : null}
            <form>
                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="row">
                    <label htmlFor="author">Author</label>
                    <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
                <div className="row">
                    <label htmlFor="year">Publish Year</label>
                    <input
                        id="year"
                        type="number"
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)}
                    />
                </div>
                <button onClick={handleSaveBook}>
                    Save
                </button>
            </form>
        </div>
    )
}

export default CreateBook;