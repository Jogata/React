// import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

const Note = ({ note }) => {
    // const note = null;
    // const navigate = useNavigate();

    if (note) {
        const created = new Date(note.createdAt).toLocaleString("en-US", { day: "numeric", month: "long" });

        const updated = new Date(note.updatedAt).toLocaleString("en-US", { day: "numeric", month: "long" });

        // const handleEdit = () => navigate(`/dash/notes/${note}`);

        return (
            <tr className="table-row">
                <td className="table-cell note-status">
                    {note.completed
                        ? <span className="completed">Completed</span>
                        : <span className="open">Open</span>
                    }
                </td>
                <td className="table-cell note-created">{created}</td>
                <td className="table-cell note-updated">{updated}</td>
                <td className="table-cell note-title">{note.title}</td>
                <td className="table-cell note-username">{note.username}</td>

                <td className="table-cell">
                    <Link
                        to={`/dash/notes/${note._id}`} 
                        className="icon-button table-button"
                        title="Edit"
                        // onClick={handleEdit}
                    >
                        edit note
                        <i className="fa fa-pencil-square-o"></i>
                    </Link>
                    {/* <button
                        className="icon-button table-button"
                        title="Edit"
                        onClick={handleEdit}
                    >
                        edit note
                        <i className="fa fa-pencil-square-o"></i>
                    </button> */}
                </td>
            </tr>
        )

    } else return null
}

export default Note;