import { useEffect, useState } from "react";
import "./navigation.css";
import { Link } from "react-router-dom";

const Navigation = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    const icon = isDarkTheme ? "fa fa-sun-o" : "fa fa-moon-o";
    const text = isDarkTheme ? "turn on light mode" : "turn on dark mode";

    useEffect(() => {
        console.log("use efffect");
        if (isDarkTheme) {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
        }
    }, [isDarkTheme])

	return (
		<nav>
            <Link to={"/"} className="logo">
                Product Store
                <i className="fa fa-shopping-cart"></i>
            </Link>
            <div className="buttons">
                <Link>
                    <i className="fa fa-plus"></i>
                </Link>
                <button onClick={() => {setIsDarkTheme(!isDarkTheme)}}>
                    {text}
                    <i className={icon}></i>
                </button>
            </div>
		</nav>
	);
};

export default Navigation;