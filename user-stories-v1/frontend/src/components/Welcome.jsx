import { Link } from "react-router-dom";

const Welcome = () => {
    const date = new Date();
    const today = new Intl.DateTimeFormat(
        "en-US", { 
            dateStyle: "full", 
            timeStyle: "long" 
        }).format(date);
        
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;
    const roles = user.roles;
    // console.log(roles);
    const isAdmin = roles.includes("Admin");
    const isManager = roles.includes("Manager");

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {username}!</h1>

            <p>
                <Link to="/dash/notes">
                    View techNotes
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/dash/notes/create">
                    Add New techNote
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            {isAdmin || isManager ? (
                <p>
                    <Link to="/dash/users">
                        View All Users
                        <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                    </Link>
                </p>
            ) : null}

            {isAdmin || isManager ? (
                <p>
                    <Link to="/dash/users/create">
                        Add New User
                        <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                    </Link>
                </p>
            ) : null}

        </section>
    )

    return content;
}

export default Welcome;