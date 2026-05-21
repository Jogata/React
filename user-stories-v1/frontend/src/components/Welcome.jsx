import { Link } from "react-router-dom";

const Welcome = () => {
    const date = new Date();
    const today = new Intl.DateTimeFormat(
        "en-US", { 
            dateStyle: "full", 
            timeStyle: "long" 
        }).format(date);

    const username = "<USER>";

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

            <p>
                <Link to="/dash/users">
                    View All Users
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

            <p>
                <Link to="/dash/users/create">
                    Add New User
                    <span><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                </Link>
            </p>

        </section>
    )

    return content;
}

export default Welcome;