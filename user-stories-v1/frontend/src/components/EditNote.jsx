import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import Loader from "./Loader";

const EditNote = () => {
    const { id } = useParams();

    const note = {};
    const users = [];

    const content = note && users ? (
        <EditNoteForm note={note} users={users} />
    ) : (
        // <p>Loading...</p>
        <Loader />
    )

    return content;
}

export default EditNote;