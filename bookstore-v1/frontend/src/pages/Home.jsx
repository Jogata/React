import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

const Home = () => {
    const [books, setBooks] = useState([]);
    // const [loading, setLoading] = useState(false);
    const [showType, setShowType] = useState("table");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publishYear, setPublishYear] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // useEffect(() => {
    //     setLoading(true);
    //     fetch("http://localhost:5555/books")
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log(data);
    //             setBooks(data);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             setLoading(false);
    //         });
    // }, []);
    const handleSaveBook = () => {
        const data = {
            title,
            author,
            publishYear,
        };

        const controller = new AbortController();

        setLoading(true);

        fetch("http://localhost:5555/books", {
            method: "POST",
            body: JSON.stringify(data),
            signal: controller.signal,
        })
            .then(() => {
                setLoading(false);
                navigate("/");
            })
            .catch((error) => {
                setLoading(false);
                // alert("An error happened. Please Chack console");
                console.error(error);
            });
    };
  

    return (
        <div className="home-page">
            <BackButton />
            {/* <div className="">
                <button
                    className=""
                    onClick={() => setShowType("table")}
                >
                    Table
                </button>
                <button
                    className=""
                    onClick={() => setShowType("card")}
                >
                    Card
                </button>
            </div>
            <div className="header">
                <h1>Books List</h1>
                <Link to="/books/create" title="Create new book">
                    Create new book
                    <i className="ri-add-line"></i>
                </Link>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <h2>TODO: map books</h2>
            )} */}

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
        </div>
    );
};

export default Home;