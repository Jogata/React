import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteBook = () => {
    setLoading(true);
      fetch(`http://localhost:5555/books/${id}`, {
        method: "DELETE"
      })
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Chack console');
        console.log(error);
      });
  };
  
  return (
    <div>
      <BackButton />
      <h1>Delete Book</h1>
      {loading ? <Spinner /> : null}
      <div>
        <h3>Are You Sure You want to delete this book?</h3>

        <button onClick={handleDeleteBook}>
          Yes, Delete it
        </button>
      </div>
    </div>
  )
}

export default DeleteBook;