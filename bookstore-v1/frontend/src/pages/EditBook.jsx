import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const EditBook = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publishYear, setPublishYear] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const controller = new AbortController();
        // console.log("effect");
        setLoading(true);

        fetch(`http://localhost:5555/books/${id}`, {
            signal: controller.signal,
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setAuthor(data.author);
                setPublishYear(data.publishYear);
                setTitle(data.title);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                // alert("An error happened. Please Chack console");
                console.log(error);
            });

        return () => {
            controller.abort();
        }
    }, [])

    const handleEditBook = (e) => {
        e.preventDefault();

        try {
            const data = {
                title,
                author,
                publishYear,
            };

            const controller = new AbortController();

            setLoading(true);

            fetch(`http://localhost:5555/books/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
            })
                .then(() => {
                    setLoading(false);
                    navigate("/");
                })
                .catch((error) => {
                    setLoading(false);
                    // alert("An error happened. Please Chack console");
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="edit-page">
            <BackButton />
            <h1>Edit Book</h1>
            {loading ? <Spinner /> : ""}
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
                <button onClick={handleEditBook}>
                    Save
                </button>
            </form>
        </div>
    )
}

export default EditBook;