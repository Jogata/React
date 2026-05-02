import { useParams } from "react-router-dom";

const EditUser = () => {
    const { userId } = useParams();
    console.log(userId);

    const user = null;

    const content = user ? "<EditUserForm user={user} />" : <p>Loading...</p>

    return content
}
export default EditUser;