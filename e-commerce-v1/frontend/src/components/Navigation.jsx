import "./navigation.css";
import { Link } from "react-router-dom";

const Navigation = () => {
	return (
		<nav>
            {/* <Link to={"/"} className="logo">Product Store 🛒</Link> */}
            <Link to={"/"} className="logo">
                Product Store
                <i className="fa fa-shopping-cart"></i>
            </Link>
            <div className="buttons">
                <Link>
                    <i className="fa fa-plus"></i>
                </Link>
                <button>
                    toggle theme
                    <i className="fa fa-sun-o"></i>
                </button>
            </div>
		</nav>
	);
};

export default Navigation;