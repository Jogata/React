// import { Link, Outlet } from "react-router-dom";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
// import Loader from "./Loader";
// import { useEffect, useState } from "react";

const DashLayout = ({ token }) => {
    const location = useLocation();
    // const [isLoading, setIsLoading] = useState(true);
    console.log(token);

    // useEffect(() => {
    //     const restoreSessionOnMount = async () => {
    //       try {
    //         const response = await fetch("http://localhost:5000/auth/refresh", { 
    //           // method: "POST",
    //           // method: "GET",
    //           credentials: "include"
    //         });
    //         console.log(response);

    //         if (response.ok) {
    //           const data = await response.json();
    //           setToken(data.accessToken);
    //           // setIsLoading(false);
    //         } else {
    //           const data = await response.json();
    //           console.log(data);
    //         }
    //       } catch (err) {
    //         console.error("Session restoration failed:", err);
    //       } finally {
    //         setIsLoading(false);
    //       }
    //     };

    //     restoreSessionOnMount();
    // }, [])

    // if (isLoading) {
    //   return <div>Verifying session...</div>;
    // return <Loader />;
    // }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // return <Outlet />;  

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

export const WelcomeDashLayout = ({ token }) => {
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

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