import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [ colorMode, toggleColorMode ] = useState("dark");

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
      <Navbar toggleTheme={toggleTheme} />
      {/* <nav>
        <h2>navbar</h2>
      </nav> */}
      <main>
        <h1>test</h1>
      </main>
      <footer>
        <h2>footer</h2>
      </footer>
    </div>
  )
}

export default App;