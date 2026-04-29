import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Welcome from "./components/Welcone";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dash" element={<Welcome />} />
      </Routes>
    </>
  )
}

export default App;
