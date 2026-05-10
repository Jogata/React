import { useParams } from "react-router-dom";

const EditNote = () => {
    const { id } = useParams();

    const note = {};
    const users = []

    const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

    return content;
}

const EditNoteForm = ({ note, users }) => {
    return (
        <h1>todo edit note form</h1>
    )
}

export default EditNote;