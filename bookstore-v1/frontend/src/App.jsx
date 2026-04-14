import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <h1 style={{
        padding: "5rem 1rem", 
        color: "brown", 
        fontSize: "5rem", 
        textAlign: "center", 
        textTransform: "capitalize", 
      }}>test</h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App;
