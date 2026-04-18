import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  let controller = null;

  const handleDeleteBook = () => {
    controller = new AbortController();

    setLoading(true);
    fetch(`http://localhost:5555/books/${id}`, {
      method: "DELETE",
      signal: controller.signal
    })
      .then(() => {
        // setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        // setLoading(false);
        // alert('An error happened. Please Chack console');
        if (error.name === "AbortError") {
          console.log("Fetch request was canceled");
        } else {
          setLoading(false);
          console.error("Fetch error:", error);
        }
      });
  };

  useEffect(() => {
    return () => {
      if (controller) {
        controller.abort();
      }
    }
  }, [controller])

  const buttonText = loading ? "Deleting..." : "Yes, Delete it";

  return (
    <div className="delete-page">
      <BackButton />
      <h1>Delete a Book</h1>
      {/* {loading ? <Spinner /> : null} */}
      <div className="main-section">
        {loading ? (
          <Spinner />
        ) : (
          <h3>Are You Sure You want to delete this book?</h3>
        )}
        {/* <h3>Are You Sure You want to delete this book?</h3> */}

        <button onClick={handleDeleteBook}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default DeleteBook;