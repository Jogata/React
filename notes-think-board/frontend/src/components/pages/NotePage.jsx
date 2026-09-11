import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "success") => {
    const newToast = { id: crypto.randomUUID(), message, type };
    setNotifications(old => [...old, newToast]);
  }, []);


  const removeNotification = (id) => {
    setNotifications(old => old.filter(toast => toast.id !== id));
  }

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

        if (error.message == "Note not found!") {
          setNote({});
          controller = null;
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

  if (!note.title) {
    return (
      <div className="section">
        <Link to={"/"} className="link-btn alt section-btn">
          <i className="fa fa-angle-double-left" aria-hidden={true}></i>
          Back to Notes
        </Link>
        <div className="inner-section">
          <h1 className="section-title">Note not found!</h1>
        </div>
      </div>
    )
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
    if (deleting) {
      console.log("The note is being deleted right now.");
      return;
    }

    try {
      setDeleting(true);
      const response = await deleteNote(id);
      // const response = await deleteNote("nvfdsbhk");

      // navigate("/");
      // setNotes(currentNotes => currentNotes.filter(note => note._id !== id));
      console.log("Note deleted successfully");
      addNotification("Note deleted successfully", "success");
    } catch (error) {
      console.log("Error in handleDelete: ", error.message);
      console.log("Failed to delete note");
      addNotification("Failed to delete note", "error");
      addNotification(error.message, "error");
      // throw new Error(error.message);
      setDeleting(false);
    }
  };

  return (
    <div className="section">

      <Notifications notifications={notifications} removeNotification={removeNotification} />

      <Link to={"/"} className="link-btn alt section-btn">
        <i className="fa fa-angle-double-left" aria-hidden={true}></i>
        Back to Notes
      </Link>
      <button
        type="button"
        className="icon delete-btn section-btn"
        title="Delete"
        onClick={() => handleDeleteNote(note._id)}
      >
        {deleting ? (
          <>
            <span className="sr-only">Delete note {note.title}</span>
            <i className="fa fa-spinner" aria-hidden="true"></i>
          </>
        ) : (
          <>
            <span className="sr-only">Deleting note {note.title}</span>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </>
        )}
      </button>
      <button
        type="button"
        className="icon edit-btn section-btn"
        title="Edit"
        onClick={() => console.log("todo edit note")}
      >
        <span className="sr-only">Edit note {note.title}</span>
        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
      </button>

      <div className="inner-section">
        <div className="note-deatails-section">
          <div className="note-details">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-text">{note.content}</p>
            <div className="note-footer">
              <span className="date">
                {formatDate(new Date(note.createdAt))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Notifications({ notifications, removeNotification }) {
  const popoverRef = useRef(null);

  useEffect(() => {
      const popoverNode = popoverRef.current;
      if (!popoverNode) return;

      if (notifications.length > 0) {
          popoverNode.showPopover();
      } else {
          popoverNode.hidePopover();
      }
  }, [notifications.length]);

  return (
    <div
      className="toast-container"
      ref={popoverRef}
      popover="manual"
      role="status"
    >
      {notifications.map(toast => (
        <Notification
          key={toast.id}
          toast={toast}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  );
}

function Notification({ toast, onDismiss }) {
  const [fadeout, setFadeout] = useState(false)
  const id = toast.id;
  console.log(toast);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeout(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [onDismiss, id]);

  // const accessibilityRole = toast.type === "error" ? "alert" : "status";
  const notificationClassName = fadeout ? (
    `toast-box ${toast.type} fade-out`
  ) : (
    `toast-box ${toast.type}`
  );

  return (
    // <div className={`toast-box ${toast.type}`} role={accessibilityRole}>
    <div className={notificationClassName} onAnimationEnd={() => onDismiss(id)}>
      <p>{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss alert"
      >
        <span>X</span>
      </button>
    </div>
  );
}

function Modal({ isModalOpen, setModalMode, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return;

    if (isModalOpen) {
      dialogNode.showModal();
      setModalMode(true);
    } else {
      dialogNode.close();
      setModalMode(false);
    }

    return () => {
      setModalMode(false);
    };
  }, [isModalOpen]);

  return (
    <dialog
      className="modal"
      ref={dialogRef}
      onClose={onClose}
      onClick={onClose}
    >
      <header>
        <button type="button" className="icon" onClick={onClose}>
          <span className="sr-only">Close Modal</span>
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
        <h2 id="modal-title">{title}</h2>
      </header>

      <div className="modal-body" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </dialog>
  );
}

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
      <span className="sr-only">
        Loading content, please wait.
      </span>
    </span>
  )
}

export default NoteDetailPage;