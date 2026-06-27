import { Link } from "react-router-dom";

const Home = () => {
    console.log("Home Component");
    const content = (
        <div className="home">
            <header>
                <h1>Welcome to <span className="nowrap">
                    Dan D. Repairs!
                </span></h1>
            </header>
            <main className="main">
                <p className="main-desc">
                    Located in Beautiful Downtown Foo City, 
                    Dan D. Repairs  provides a trained staff 
                    ready to meet your tech repair needs
                </p>
                <address className="addr">
                    <span>Dan D. Repairs</span>
                    <span>555 Foo Drive</span>
                    <span>Foo City, CA 12345</span>
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>
                
                <p>Owner: Dan Davidson</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </div>
    )

    return content;
}

export default Home;