import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/pages/Home";
import CreateProductPage from "./components/pages/CreateProductPage";
import ProductPage from "./components/pages/ProductPage";

function App() {
  const [colorMode, toggleColorMode] = useState("dark");
  const [modalMode, setModalMode] = useState(false);

  function toggleTheme() {
    const themes = {
      "dark": "light",
      "light": "dark"
    }

    const newTheme = themes[colorMode];
    toggleColorMode(newTheme);
  }

  let pageClass = `page ${colorMode}`;
  pageClass = modalMode ? `${pageClass} modal-mode` : pageClass;

  return (
    <div className={pageClass}>
      <Navbar toggleTheme={toggleTheme} colorMode={colorMode} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage modalMode={modalMode} setModalMode={setModalMode} />} />
          <Route path="/create" element={<CreateProductPage />} />
        </Routes>
      </main>
      <footer>
        <h2>footer</h2>
      </footer>
    </div>
  )
}

export default App;