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
              <a
                href="/#"
                onClick={login}
                className="nav-link"
              >
                Logout {user.name}
              </a>
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

// function Login() {
//   return (
//     <h1>Login Page</h1>
//   )
// }

export default App;