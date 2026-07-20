import { createContext, useContext, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import RestaurantsList from "./components/restaurants-list";
import Restaurant from "./components/restaurant";
import Login from "./components/login";
import AddReview from "./components/add-review";

function App() {
  // const [user, setUser] = useState(() => localStorage.getItem("user"));

  // async function login(user = null) {
  //   setUser(user);
  //   localStorage.setItem("user", JSON.stringify(user));
  // }

  // async function logout(user = null) {
  //   setUser(null);
  //   localStorage.removeItem("user");
  // }

  return (
    <UserContextProvider>
      <div className="page">
        <Navigation />
        <Routes>
          <Route path="/" element={<RestaurantsList />} />
          <Route path="/restaurants" element={<RestaurantsList />} />
          <Route path="/restaurants/:id" element={<Restaurant />} />
          <Route path="/restaurants/:id/review" element={<AddReview />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </UserContextProvider>
  )
}

function Navigation() {
  const { user, logout } = useContext(UserContext);

  return (
    <nav className="navbar">
      <a href="/restaurants" className="navbar-logo">
        Restaurant Reviews
      </a>
      <ul>
        <li>
          <Link to={"/restaurants"} className="nav-link">
            Restaurants
          </Link>
        </li>
        <li>
          {user ? (
            <button
              onClick={logout}
              className="btn-primary"
            >
              Logout {user.name}
            </button>
          ) : (
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}

export const UserContext = createContext(null);

function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    function checkStorage() {
        const newUserState = JSON.parse(localStorage.getItem("user"));
        // console.log(newUserState);
        setUser(newUserState);
    }

    window.addEventListener("storage", checkStorage);

    return () => window.removeEventListener("storage", checkStorage);
}, [])

  async function login(user = null) {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  async function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  const ctx = {
    user,
    login,
    logout
  }

  return <UserContext.Provider value={ctx}>
    {children}
  </UserContext.Provider>
}

export default App;