import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

async function logout2(setToken) {
    try {
        const response = await fetch("http://localhost:5000/auth/logout", {
            method: "POST", 
            credentials: "include"
        });
        console.log(response);
        setToken(null);
        localStorage.removeItem("user");

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            const data = await response.json();
            console.log(data);
        }
    } catch (err) {
        console.error("Logout failed:", err);
    }
};

const DashLayout = ({ token, setToken, logout }) => {
    const location = useLocation();
    console.log("DashLayout: " + token);

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="dash-page">
            <DashHeader setToken={setToken} logout={logout} />
            <main>
                <Outlet />
            </main>
            <DashFooter />
        </div>
    )
}

const DashHeader = ({setToken, logout}) => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user.username);
    const isAdmin = user?.roles?.includes("Admin");
    console.log(isAdmin);
    const isManager = user?.roles?.includes("Manager");
    console.log(isManager);

    const { pathname } = useLocation()

    const DASH_REGEX = /^\/dash(\/)?$/;
    const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
    const USERS_REGEX = /^\/dash\/users(\/)?$/;

    let newNoteLink = null;
    if (NOTES_REGEX.test(pathname)) {
        newNoteLink = (
            <Link
                className="redirect-link"
                title="New Note"
            >
                Create New Note
                <i className="fa fa-file-text-o"></i>
            </Link>
        )
    }

    const content = (
        <header className="dash-header">
            <div className="dash-header-container">
                <Link to="/dash">
                    <h1 className="dash-header-title">techNotes</h1>
                </Link>
                <nav className="dash-header-nav">
                    {/* TODO add nav buttons */}
                    {newNoteLink}
                    <button
                        className="submit-button"
                        title="Logout"
                        onClick={() => logout2(setToken)}
                    >
                        Logout2
                    </button>
                    <button
                        className="submit-button"
                        title="Logout"
                        onClick={() => logout()}
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    )

    return content;
}

const DashFooter = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const content = (
        <footer className="dash-footer">
            <Link
                to="/dash"
                className="dash-footer-button icon-button"
                title="Dashboard"
            >
                to Dashboard
                <i className="fa fa-home"></i>
            </Link>
            <p>Current User: {user.username}</p>
            <p>Status: {user.roles[0]}</p>
        </footer>
    )

    return content;
}

export const WelcomeDashLayout = ({ token, setToken, logout }) => {
    const location = useLocation();
    console.log("WelcomeDashLayout: " + token);

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="dash-page">
            <DashHeader setToken={setToken} logout={logout} />
            <main>
                <Outlet />
            </main>
            <WelcomeDashFooter />
        </div>
    )
}

const WelcomeDashFooter = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);

    const content = (
        <footer className="dash-footer">
            <p>Current User: {user.username}</p>
            <p>Status: {user.roles[0]}</p>
        </footer>
    )

    return content;
}

export default DashLayout;