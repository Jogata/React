import { Link } from "react-router-dom";

function Navbar({ toggleTheme, colorMode }) {
    return (
        <header>
            <nav>
                <ul>
                    <li className="logo">
                        <Link to="/">Product Store 🛒</Link>
                    </li>

                    <li>
                        <Link
                            to="/create"
                            className="icon"
                            title="Create"
                        >
                            <i className="fa fa-file-text-o"></i>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={toggleTheme}
                            className="icon"
                            title="Toggle theme"
                        >
                            {colorMode === "light" ? (
                                <i className="fa fa-moon-o"></i>
                            ) : (
                                <i className="fa fa-sun-o"></i>
                            )}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;