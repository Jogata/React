import BookCard from "./BookCard";

const BookCards = ({ books }) => {
    return (
        <div className="cards">
            {books.map(book => (
                <BookCard book={book} key={book._id} />
            ))}
        </div>
    );
};

export default BookCards;