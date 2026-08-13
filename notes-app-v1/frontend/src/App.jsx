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

  // console.log(modalMode, pageClass);

  return (
    <div className={pageClass}>
      <Navbar toggleTheme={toggleTheme} colorMode={colorMode} />
      <NotificationManager />
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

function NotificationManager() {
  const [notifications, setNotifications] = useState([]);

  function addNotification(message, type = "success") {
    const newToast = {
      id: crypto.randomUUID(),
      message,
      type
    };

    setNotifications(old => [...old, newToast]);
  }

  function removeNotification(id) {
    setNotifications(old => old.filter(toast => toast.id !== id));
  }

  return (
    <div className="toast-container" popover="manual">
      {notifications.map((toast) => (
        <h2>{toast.message}</h2>
      ))}
    </div>
  );
}

export default App;