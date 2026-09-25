import { Link } from "react-router";

const NotesNotFound = () => {
    return (
        <div className="">
            <div className="">
                <i className="fa fa-notebook"></i>
            </div>
            <h1 className="">No notes yet</h1>
            <p className="">
                Ready to organize your thoughts? Create your
                first note to get started on your journey.
            </p>
            <Link to="/create" className="btn">
                Create Your First Note
            </Link>
        </div>
    );
}

export default NotesNotFound;