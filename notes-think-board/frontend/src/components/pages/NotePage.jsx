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

    async function getNoteByID() {
        const response = await fetch(`http://localhost:5000/api/note/:${id}`, {
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

  return (
    <div>
      <div>
        <div>
          <div>
            <button className="btn">
              Delete Note
            </button>
          </div>

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