import { Link } from "react-router-dom";

function Navbar({ toggleTheme, colorMode }) {
    return (
        // <nav>
        //     <h1>Logo</h1>
        //     <button onClick={toggleTheme}>toggle</button>
        // </nav>
        <nav>
            <ul>
                <li className="logo">
                    <Link to="/">Product Store 🛒</Link>
                </li>

                <li>
                    <Link 
                        to="/create"
                        title="Create"
                    >
                        <i className="fa fa-file-text-o"></i>
                    </Link>
                </li>
                <li>
                    <button
                        onClick={toggleTheme}
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
    );
};

export default Navbar;