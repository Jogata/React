import { Outlet } from "react-router-dom";

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
    return (
        <footer>
        <h1>DashFooter</h1>
        </footer>
    )
}

export default DashLayout;