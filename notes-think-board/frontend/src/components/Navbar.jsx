import { Link } from "react-router";

const Navbar = () => {
    return (
        <header>
            <nav>
                <Link to="/" className="logo"><span>Think</span>Board</Link>
                <div>
                    <Link to={"/test"} className="link-btn">
                        <i className="fa fa-bars" aria-hidden="true"></i>
                        <span>Test Link</span>
                    </Link>
                    <Link to={"/create"} className="link-btn">
                        <i className="fa fa-plus" aria-hidden="true"></i>
                        <span>New Note</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;