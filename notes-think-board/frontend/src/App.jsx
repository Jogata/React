import { Route, Routes } from "react-router";
import { Link } from "react-router";
import HomePage from "./components/pages/HomePage";
import CreatePage from "./components/pages/CreatePage";

const App = () => {
  return (
    <div className="page">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </main>
    </div>
  );
};

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link to="/" className="logo"><span>Think</span>Board</Link>
        <div>
          <Link to={"/create"} className="link-btn">
            <i className="fa fa-plus" aria-hidden="true"></i>
            <span>New Note</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

// const Spinner = () => {
//   return (
//       <span className="loader">
//           <div className="logo-ring"></div>
//           <div className="logo-ring"></div>
//           <div className="logo-ring"></div>
//           <div className="logo-ring"></div>
//       </span>
//   )
// }

export default App;