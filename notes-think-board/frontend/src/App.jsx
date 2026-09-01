import { Route, Routes } from "react-router";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<TestCreate />} />
      </Routes>
    </>
  );
};

import { Link } from "react-router";
import HomePage from "./components/pages/HomePage";

const Navbar = () => {
  return (
    <header>
      <div>
        <nav>
          <Link to="/" className="logo"><span>Think</span>Board</Link>
          <div>
            <Link to={"/create"} className="link-btn">
              <i className="fa fa-plus" aria-hidden="true"></i>
              <span>New Note</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

function TestCreate() {
  return <h1 className="test">Test Create page</h1>
}

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