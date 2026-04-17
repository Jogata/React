import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const BookDetails = () => {
    const [book, setBook] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        fetch(`http://localhost:5555/books/${id}`, {
            signal: controller.signal
        })
            .then(res => res.json())
            .then(data => {
                setBook(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <div className="book-page">
            <BackButton />
            <h1>{book.title}</h1>
            {loading ? (
                <Spinner />
            ) : (
                // <div className="book-info">
                //     <div className="row">
                //         <span className="property-name">Id</span>
                //         <span>{book._id}</span>
                //     </div>
                //     <div className="row">
                //         <span className="property-name">Title</span>
                //         <span>{book.title}</span>
                //     </div>
                //     <div className="row">
                //         <span className="property-name">Author</span>
                //         <span>{book.author}</span>
                //     </div>
                //     <div className="row">
                //         <span className="property-name">Publish Year</span>
                //         <span>{book.publishYear}</span>
                //     </div>
                //     <div className="row">
                //         <span className="property-name">Create Time</span>
                //         <span>{new Date(book.createdAt).toString()}</span>
                //     </div>
                //     <div className="row">
                //         <span className="property-name">Last Update Time</span>
                //         <span>{new Date(book.updatedAt).toString()}</span>
                //     </div>
                // </div>
                <dl className="book-info">
                    <div className="row">
                        <dt>Id</dt>
                        <dd>{book._id}</dd>
                    </div>
                    <div className="row">
                        <dt>Title</dt>
                        <dd>{book.title}</dd>
                    </div>
                    <div className="row">
                        <dt>Author</dt>
                        <dd>{book.author}</dd>
                    </div>
                    <div className="row">
                        <dt>Publish Year</dt>
                        <dd>{book.publishYear}</dd>
                    </div>
                    <div className="row">
                        <dt>Create Time</dt>
                        <dd>{new Date(book.createdAt).toString()}</dd>
                    </div>
                    <div className="row">
                        <dt>Last Update Time</dt>
                        <dd>{new Date(book.updatedAt).toString()}</dd>
                    </div>
                </dl>

            )}
        </div>
    );
};

export default BookDetails;