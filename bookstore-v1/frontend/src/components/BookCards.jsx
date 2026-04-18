import { Link } from "react-router-dom";

const BookCards = ({ books }) => {
    return (
        <div className="cards">
            {books.map(book => (
                <div className="card">
                    <h2 className="year">
                        {book.publishYear}
                    </h2>
                    <h4 className="book-id">{book._id}</h4>
                    <div className="book-title">
                        <i className="fa fa-book"></i>
                        <h2 className='my-1'>{book.title}</h2>
                    </div>
                    <div className="author">
                        <i className="fa fa-user-o"></i>
                        <h2 className='my-1'>{book.author}</h2>
                    </div>
                    <div className="actions">
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
            )
            )}
        </div>
    );
};

export default BookCards;