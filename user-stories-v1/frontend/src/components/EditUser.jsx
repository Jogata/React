import { useParams } from "react-router-dom";
import Loader from "./Loader";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
    const { userId } = useParams();
    // console.log(userId);

    // const user = null;
    const user = {
        roles: ["Employee"], 
        active: true
    };

    const content = user ? <EditUserForm user={user} /> : <Loader />

    return content;
}

export default EditUser;