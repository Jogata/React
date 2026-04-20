// import { useState } from "react";
import { Link } from "react-router-dom";
import BookModal from "./BookModal";

const BookCard = ({ book }) => {
    // const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="card">
                <div className="card-row top-row">
                    <h2 className="year">
                        {book.publishYear}
                    </h2>
                    <h4 className="book-id">{book._id}</h4>
                </div>
                <div className="card-row book-title">
                    <i className="fa fa-book"></i>
                    <h2>{book.title}</h2>
                </div>
                <div className="card-row author">
                    <i className="fa fa-user-o"></i>
                    <h2>{book.author}</h2>
                </div>
                <div className="actions">
                    <BookModal book={book} />
                    {/* <button onClick={() => setShowModal(true)}>
                        show modal
                        <i className="fa fa-eye"></i>
                    </button> */}
                    <Link to={`/books/details/${book._id}`}>
                        <i className="ri-information-line"></i>
                    </Link>
                    <Link to={`/books/edit/${book._id}`}>
                        <i className="ri-edit-line"></i>
                    </Link>
                    <Link to={`/books/delete/${book._id}`}>
                        <i className="fa fa-trash-o"></i>
                    </Link>
                </div>
            </div>
            {/* {showModal && (
                <BookModal
                    book={book}
                    onClose={() => setShowModal(false)}
                />
            )} */}
        </>
    );
};

export default BookCard;