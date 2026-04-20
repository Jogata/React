import { useEffect, useRef } from "react";

const BookModal = ({ book, onClose }) => {
    const focusPoint = useRef(null);

    useEffect(() => {
        console.log(focusPoint.current);
        focusPoint.current.focus();
    }, [focusPoint.current])

    return (
        <div className="modal" onClick={onClose}>
            <div 
                className="modal-box"
                onClick={(event) => event.stopPropagation()} 
            >
                <h2 
                    className="year" 
                    ref={focusPoint} 
                    tabIndex="-1"
                >
                    {book.publishYear}
                </h2>
                <h4>{book._id}</h4>
                <div className="row">
                    <i className="fa fa-book"></i>
                    <h2>{book.title}</h2>
                </div>
                <div className="row">
                    <i className="fa fa-user-o"></i>
                    <h2>{book.author}</h2>
                </div>
                <p>Anything You want to show</p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni quia
                    voluptatum sint. Nisi impedit libero eveniet cum vitae qui expedita
                    necessitatibus assumenda laboriosam, facilis iste cumque a pariatur
                    nesciunt cupiditate voluptas? Quis atque earum voluptate dolor nisi
                    dolorum est? Deserunt placeat cumque quo dicta architecto, dolore
                    vitae voluptate sequi repellat!
                </p>
                <button onClick={onClose}>
                    close
                    <i className="ri-close-line"></i>
                </button>
            </div>
        </div>
    );
};

export default BookModal;