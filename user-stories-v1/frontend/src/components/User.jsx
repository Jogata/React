import { useEffect } from "react";
import { Link } from "react-router-dom";

const User = ({ user }) => {
    if (user) {
        const userRolesString = user.roles.toString().replaceAll(",", ", ");

        const cellStatus = user.active ? "active" : "inactive";

        return (
            <tr className="table-row user">
                <td className={`table-cell ${cellStatus}`}>{user.username}</td>
                <td className={`table-cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table-cell edit-col ${cellStatus}`}>
                    <Link
                        to={`/dash/users/edit/${user._id}`}
                        className="icon-button table-button"
                        title="Edit"
                    >
                        Edit user
                        <i className="fa fa-pencil-square-o"></i>
                    </Link>
                </td>
            </tr>
        )
    } else {
        return null;
    }
}

export default User;