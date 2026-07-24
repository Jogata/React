import { Link } from "react-router-dom";

function Navbar({toggleTheme}) {
    return (
        <nav>
            <h1>Logo</h1>
            <button onClick={toggleTheme}>toggle</button>
        </nav>
    );
};

export default Navbar;