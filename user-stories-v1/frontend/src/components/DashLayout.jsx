import { Link, Outlet } from "react-router-dom";

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
    // const { pathname } = useLocation();

    // let goHomeButton = null;

    // if (pathname !== "/dash") {
    //     goHomeButton = (
    //         <Link 
    //             to="/dash"
    //             className="dash-footer-button icon-button"
    //             title="Home"
    //         >
    //             home
    //             <i className="fa fa-home"></i>
    //         </Link>
    //     )
    // }

    const content = (
        <footer className="dash-footer">
            {/* {goHomeButton} */}
            <Link 
                to="/dash"
                className="dash-footer-button icon-button"
                title="Home"
            >
                home
                <i className="fa fa-home"></i>
            </Link>
            <p>Current User:</p>
            <p>Status:</p>
        </footer>
    )

    return content;
}

export const WelcomeDashLayout = () => {
    return (
        <div className="dash-page">
            <DashHeader />
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