import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/pages/Home";

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
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      <footer>
        <h2>footer</h2>
      </footer>
    </div>
  )
}

// function Home() {
//   return (
//     <>
//       <header className="main-header">
//         <h1>test</h1>
//       </header>
//       <section className="main-body"><Cards /></section>
//     </>
//   )
// }

function Cards() {
  const products = [
    {name: "test1"}, 
    {name: "test2"}, 
    {name: "test3"}, 
  ];

  return (
    products.map((product, index) => {
      return <h2 key={index}>{product.name}</h2>
    })
  )
}

export default App;