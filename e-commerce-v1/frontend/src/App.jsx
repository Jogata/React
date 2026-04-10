import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";

function App() {
  return (
    <div className="page">
      <Navigation />
      <main>
        <Routes>
	  			<Route path="/" element={<HomePage />} />
		  		<Route path="/create" element={<CreatePage />} />
			  </Routes>
      </main>
    </div>
  )
}

export default App;