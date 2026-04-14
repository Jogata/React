import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showType, setShowType] = useState("table");

    useEffect(() => {
        setLoading(true);
        // fetch("http://localhost:5555/books")
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log(data);
        //         setBooks(data);
        //         setLoading(false);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         setLoading(false);
        //     });
    }, []);

    return (
        <div className="">
            <div className="">
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
            <div className="">
                <h1>Books List</h1>
                <Link to="/books/create">
                    Create new book
                </Link>
            </div>
            {loading ? (
                // <h2>loading</h2>
                <Spinner />
            ) : (
                <h2>TODO: map books</h2>
            )}
        </div>
    );
};

export default Home;