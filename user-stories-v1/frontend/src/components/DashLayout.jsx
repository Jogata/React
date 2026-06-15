import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

async function logout(setToken) {
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

const DashLayout = ({ token, setToken }) => {
    const location = useLocation();
    // console.log(token);

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="dash-page">
            <DashHeader setToken={setToken} />
            <main>
                <Outlet />
            </main>
            <DashFooter />
        </div>
    )
}

const DashHeader = ({setToken}) => {
    const content = (
        <header className="dash-header">
            <div className="dash-header-container">
                <Link to="/dash">
                    <h1 className="dash-header-title">techNotes</h1>
                </Link>
                <nav className="dash-header-nav">
                    {/* TODO add nav buttons */}
                    <button
                        className="submit-button"
                        title="Logout"
                        onClick={() => logout(setToken)}
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
            <p>Current User:</p>
            <p>Status:</p>
        </footer>
    )

    return content;
}

export const WelcomeDashLayout = ({ token, setToken }) => {
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="dash-page">
            <DashHeader setToken={setToken} />
            <main>
                <Outlet />
            </main>
            <WelcomeDashFooter />
        </div>
    )
}

const WelcomeDashFooter = () => {
    const content = (
        <footer className="dash-footer">
            <p>Current User:</p>
            <p>Status:</p>
        </footer>
    )

    return content;
}

export default DashLayout;