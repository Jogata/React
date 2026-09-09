import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    let controller = new AbortController();
    loadNote();

    async function loadNote() {
      setLoading(true);
      try {
        const note = await getNoteByID(id);
        setNote(note);
        // setError(null);
        controller = null;
      } catch (error) {
        // setError(err.message);
        if (error.name === "AbortError") {
          console.log("Fetch safely aborted by layout unmount");
          return;
        }

        controller = null;
        console.log("Error fetching note");
        console.log(error.message);
        console.log("Failed to load note");
      } finally {
        if (controller === null) {
          setLoading(false);
        }
      }
    }

    async function getNoteByID(id) {
      console.log(id);
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        signal: controller.signal
      });

      const contentType = response.headers.get("content-type");
      let result = null;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (response.ok) {
        return result;
      } else {
        const errorMessage = result.message || "An error occurred";
        throw new Error(errorMessage);
      }
    };

    return () => {
      if (controller) {
        controller.abort();
      }
    }
  }, []);

  if (loading) {
    return <Spinner />;
  }

  async function deleteNote(id) {
    const response = await fetch(
      `http://localhost:5000/api/notes/${id}`, {
      method: "DELETE"
    });

    const contentType = response.headers.get("content-type");
    let result = null;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (response.ok) {
      return result;
    } else {
      const errorMessage = result.message || "An error occurred";
      throw new Error(errorMessage);
    }
  }

  async function handleDeleteNote(id) {
    try {
      const response = await deleteNote(id);
      // const response = await deleteNote("nvfdsbhk");

      navigate("/");
      // setNotes(currentNotes => currentNotes.filter(note => note._id !== id));
      // console.log("Note deleted successfully");
      // addNotification("Note deleted successfully", "success");
    } catch (error) {
      console.log("Error in handleDelete: ", error.message);
      console.log("Failed to delete note");
      // addNotification("Failed to delete note", "error");
      // addNotification(error.message, "error");
      // throw new Error(error.message);
    }
  };

  return (
    <div className="section">

      <Link to={"/"} className="link-btn alt">
        <i className="fa fa-angle-double-left" aria-hidden={true}></i>
        Back to Notes
      </Link>
      <button
        type="button"
        className="icon delete-btn"
        title="Delete"
        onClick={() => handleDeleteNote(note._id)}
      >
        <span className="sr-only">Delete note {note.title}</span>
        <i className="fa fa-trash-o" aria-hidden="true"></i>
      </button>

      <div className="inner-section">
        <div>
          <div className="card">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div className="card-actions">
                <button className="btn btn-primary">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Spinner = () => {
  return (
    <span
      className="loader"
      role="status"
      aria-live="polite"
    >
      <div className="logo-ring"></div>
      <div className="logo-ring"></div>
      <div className="logo-ring"></div>
      <div className="logo-ring"></div>
      <span className="sr-only">Loading content, please wait.</span>
    </span>
  )
}

export default NoteDetailPage;