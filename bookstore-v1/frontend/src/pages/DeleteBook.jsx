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
          // console.log(error);
        }
      });
  };

  useEffect(() => {
    return () => {
      // try {
      if (controller) {
        controller.abort();
      }
      // controller.abort();
      // } catch (error) {
      // console.log(error);
      // if (error.name === "AbortError") {
      // console.log("Fetch request was canceled");
      // } else {
      // console.error("Fetch error:", error);
      // }
    }
  // }
  }, [controller])

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