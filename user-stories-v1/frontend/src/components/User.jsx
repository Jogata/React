import { useNavigate } from "react-router-dom";

const User = ({ user }) => {
    // const user = {
    //     username: "test", 
    //     roles: ["role1", "role2", "role3"]
    // };

    const navigate = useNavigate();

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${user._Id}`);

        const userRolesString = user.roles.toString().replaceAll(",", ", ");

        const cellStatus = user.active ? "active" : "inactive";

        return (
            <tr className="table-row user">
                <td className={`table-cell ${cellStatus}`}>{user.username}</td>
                <td className={`table-cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table-cell user-edit ${cellStatus}`}>
                    <button
                        className="icon-button table-button"
                        onClick={handleEdit}
                    >
                        <i className="fa fa-pencil-square-o"></i>
                    </button>
                </td>
            </tr>
        )
    } else {
        return null;
    }
}

export default User;