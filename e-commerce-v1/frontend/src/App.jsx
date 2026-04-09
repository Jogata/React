import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div className="page">
      <Navigation />
      <Routes>
				<Route path="/" element={<HomePage />} />
			</Routes>
    </div>
  )
}

export default App;