import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const EditBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();

  const controller = new AbortController();

  useEffect(() => {
    setLoading(true);
    
    fetch(`http://localhost:5555/books/${id}`, {
        signal: controller.signal,
    })
    .then(res => res.json())
    .then(data => {
        setAuthor(data.author);
        setPublishYear(data.publishYear)
        setTitle(data.title)
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        // alert("An error happened. Please Chack console");
        console.log(error);
      });

      return () => {
        controller.abort();
      }
  }, [])
  
  const handleEditBook = () => {
    const data = {
      title,
      author,
      publishYear,
    };

    const controller = new AbortController();

    setLoading(true);

      fetch(`http://localhost:5555/books/${id}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
          },
        signal: controller.current.signal,
      })
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        // alert("An error happened. Please Chack console");
        console.log(error);
      });
  };

  return (
    <div>
      <BackButton />
      <h1>Edit Book</h1>
      {loading ? <Spinner /> : ""}
      <div>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label>Publish Year</label>
          <input
            type="number"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
          />
        </div>
        <button onClick={handleEditBook}>
          Save
        </button>
      </div>
    </div>
  )
}

export default EditBook;