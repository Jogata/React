import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import RestaurantsList from "./components/restaurants-list";
import Restaurant from "./components/restaurant";
import Login from "./components/login";

function App() {
  const [user, setUser] = useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout(user = null) {
    setUser(null);
  }

  useEffect(() => {
    return () => {
      console.log("unmount app");
    }
  })

  return (
    <div className="page">
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
      <Routes>
        <Route path="/" element={<RestaurantsList />} />
        <Route path="/restaurants" element={<RestaurantsList />} />
        <Route path="/restaurants/:id" element={<Restaurant userId={user?.id} />} />
        <Route path="/restaurants/:id/review" element={<AddReview />} />
        <Route path="/login" element={<Login login={login} />} />
      </Routes>
    </div>
  )
}

function AddReview() {
  return (
    <h1>AddReview Page</h1>
  )
}

export default App;