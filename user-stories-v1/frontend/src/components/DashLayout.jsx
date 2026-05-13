import { Outlet, useLocation, useNavigate } from "react-router-dom";

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
    return (
        <header>
        <h1>dash header</h1>
        </header>
    )
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