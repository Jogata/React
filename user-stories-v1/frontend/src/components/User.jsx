// import { Link } from "react-router-dom";

const User = ({ user }) => {
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
}

export default User;



import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const logout = () => {
        navigate("/login");
    };
 
    const getPayment = async () => {
        const response = await fetch("http://localhost:5000/payment", {
            withCredentials: true,
        });
        console.log("Response: ", response);
    };
 
    return (
        <>
            <h1>Welcome Home Bud!</h1>
            <button 
                className="submit-button"
                onClick={getPayment}
            >
                Get Payment
            </button>
            <button 
                className="submit-button"
                onClick={logout}
            >
                Logout
            </button>
        </>
    );
} 
 
export const Test = { Home };