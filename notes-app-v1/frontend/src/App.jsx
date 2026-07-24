import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [colorMode, toggleColorMode] = useState("dark");

  function toggleTheme() {
    const themes = {
      "dark": "light",
      "light": "dark"
    }

    const newTheme = themes[colorMode];
    toggleColorMode(newTheme);
  }

  const pageClass = `page ${colorMode}`;

  return (
    <div className={pageClass}>
      <Navbar toggleTheme={toggleTheme} colorMode={colorMode} />
      {/* <nav>
        <h2>navbar</h2>
      </nav> */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <footer>
        <h2>footer</h2>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <main>
      <h1>test</h1>
    </main>
  )
}

export default App;