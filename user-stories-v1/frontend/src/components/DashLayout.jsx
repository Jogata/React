import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const DashLayout = () => {
    return (
        <div className="dash-page">
            <DashHeader />
            <main>
                <Outlet />
            </main>
            <DashFooter />
        </div>
    )
}

const DashHeader = () => {
    const content = (
        <header className="dash-header">
            <div className="dash-header-container">
                <Link to="/dash">
                    <h1 className="dash-header-title">techNotes</h1>
                </Link>
                <nav className="dash-header-nav">
                    {/* TODO add nav buttons */}
                </nav>
            </div>
        </header>
    )

    return content;
}

const DashFooter = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onGoHomeClicked = () => navigate("/dash");

    let goHomeButton = null;

    if (pathname !== "/dash") {
        goHomeButton = (
            <button
                className="dash-footer-button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                home
                <i className="fa fa-home"></i>
            </button>
        )
    }

    const content = (
        <footer className="dash-footer">
            {goHomeButton}
            <p>Current User:</p>
            <p>Status:</p>
        </footer>
    )

    return content;
}

export default DashLayout;