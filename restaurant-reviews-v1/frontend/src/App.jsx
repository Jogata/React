import { useState } from "react";
import { Route, Routes } from "react-router-dom";

function App() {
  const [ user, setUser ] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurants" element={<RestaurantsList />} />
      <Route path="/restaurants/:id" element={<Restaurant />} />
      <Route path="/restaurants/:id/review" element={<AddReview />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

function Home() {
  return (
    <h1>Home Page</h1>
  )
}

function RestaurantsList() {
  return (
    <h1>RestaurantsList Page</h1>
  )
}

function Restaurant() {
  return (
    <h1>Restaurant Page</h1>
  )
}

function AddReview() {
  return (
    <h1>AddReview Page</h1>
  )
}

function Login() {
  return (
    <h1>Login Page</h1>
  )
}

export default App;