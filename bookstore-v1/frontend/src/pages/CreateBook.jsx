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

    // useEffect(() => {
    //     console.log("render");
    // })

    const handleSaveBook = () => {
        try {
            const data = {
                title,
                author,
                publishYear,
            };

            data.title = "test title";
            data.author = "test author";
            data.publishYear = 2000;

            if (controller.current) {
                console.log("Old controller aborted");
                controller.current.abort();
            }

            // controller = new AbortController();
            console.log(controller);

            if (
                !data.title ||
                !data.author ||
                !data.publishYear
            ) {
                console.log("Send all required fields: title, author, publishYear");
                // controller = null;
                // setLoading(false);
                return {
                    message: "Send all required fields: title, author, publishYear",
                }
            }

            setLoading(true);

            controller.current = new AbortController();
            console.log(controller);

            // try {
            fetch("http://localhost:5555/books/test", {
                method: "POST",
                body: JSON.stringify(data),
                signal: controller.current.signal,
            })
                .then((res) => {
                    setLoading(false);
                    // console.log(res);
                    return res.json();
                    // navigate("/");
                })
                .then(data => {
                    console.log(data.message);
                    // navigate("/");
                })
                .catch((error) => {
                    // setLoading(false);
                    console.log("catched");
                    // alert("An error happened. Please Check console");
                    // console.log("error");
                    // console.error(error);
                    if (error.name === "AbortError") {
                        console.log("Fetch request was canceled");
                    } else {
                        console.error("Fetch error:", error);
                    }
                })
            .finally(() => {
                console.log("finally");
                setLoading(false);
            });
        } catch (error) {
            // console.log("catched");
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
            console.log("clean");
            if (controller.current) {
                controller.current.abort();
            }
        };
    }, [controller])

    return (
        <div>
            <BackButton />
            <h1>Create Book</h1>
            {loading ? <Spinner /> : ""}
            <div>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Author</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
                <div>
                    <label>Publish Year</label>
                    <input
                        type="number"
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)}
                    />
                </div>
                <button onClick={handleSaveBook}>
                    Save
                </button>
            </div>
        </div>
    )
}

export default CreateBook;