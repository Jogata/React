import { useEffect } from "react";
import { Link } from "react-router-dom";

// const User = ({ user }) => {
//     if (user) {
//         const userRolesString = user.roles.toString().replaceAll(",", ", ");

//         const cellStatus = user.active ? "active" : "inactive";

//         return (
//             <tr className="table-row user">
//                 <td className={`table-cell ${cellStatus}`}>{user.username}</td>
//                 <td className={`table-cell ${cellStatus}`}>{userRolesString}</td>
//                 <td className={`table-cell edit-col ${cellStatus}`}>
//                     <Link
//                         to={`/dash/users/edit/${user._id}`}
//                         className="icon-button table-button"
//                         title="Edit"
//                     >
//                         Edit user
//                         <i className="fa fa-pencil-square-o"></i>
//                     </Link>
//                 </td>
//             </tr>
//         )
//     } else {
//         return null;
//     }
// }

function User() {
    async function getAllUsers(url) {
        try {
            const res = await fetch(url);
            return res;
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }

    console.log("test user");

    useEffect(() => {
        setUpData();
        
        async function setUpData() {
            try {
                // setStatus("loading");
                const res = await getAllUsers("http://localhost:5000/users");
                // const result = await res.json();

                console.log(res);
    
                if (!res.ok) {
                    // setStatus("error");
                    // setErrors([result]);
                } else {
                    // setStatus("success");
                    // setUsers(result.data);
                }
            } catch (error) {
                console.log("server error");
                // setStatus("error");
                // setErrors([error.message]);
            }
        }

        return () => console.log("clean up user");
    }, [])
}

export default User;