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
                            <span className="sr-only">Create new product</span>
                            <i className="fa fa-file-text-o" aria-hidden="true"></i>
                        </Link>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="icon"
                            title="Toggle theme"
                        >
                            {colorMode === "light" ? (
                                <>
                                    <span className="sr-only">Dark theme</span>
                                    <i className="fa fa-moon-o" aria-hidden="true"></i>
                                </>
                            ) : (
                                <>
                                    <span className="sr-only">Light theme</span>
                                    <i className="fa fa-sun-o" aria-hidden="true"></i>
                                </>
                            )}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;