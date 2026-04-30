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

            <p><Link to="/dash/notes">View techNotes</Link></p>

            <p><Link to="/dash/notes/new">Add New techNote</Link></p>

            <p><Link to="/dash/users/create">Add New User</Link></p>

        </section>
    )

    return content;
}

export default Welcome;