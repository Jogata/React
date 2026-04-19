import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import BooksTable from "../components/BooksTable";
import BookCards from "../components/BookCards";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showType, setShowType] = useState("table");

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5555/books")
            .then(res => res.json())
            .then(data => {
                setBooks(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const content = showType == "table" ? (
        <BooksTable books={books} />
    ) : (
        <BookCards books={books} />
    );

    return (
        <div className="home-page">
            <div className="type-buttons">
                <button
                    className="type-btn"
                    onClick={() => setShowType("table")}
                >
                    Table
                </button>
                <button
                    className="type-btn"
                    onClick={() => setShowType("cards")}
                >
                    Cards
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
                content
            )}
        </div>
    );
};

export default Home;