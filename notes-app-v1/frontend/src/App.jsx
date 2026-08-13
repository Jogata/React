import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/pages/Home";
import CreateProductPage from "./components/pages/CreateProductPage";
import ProductPage from "./components/pages/ProductPage";

function App() {
  const [colorMode, toggleColorMode] = useState("dark");
  const [modalMode, setModalMode] = useState(false);
  const [notifications, setNotifications] = useState([]);

  function addNotification(message, type = "success") {
    const newToast = {
      id: crypto.randomUUID(),
      message,
      type
    };

    setNotifications(old => [...old, newToast]);
  }

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
      <NotificationManager notifications={notifications} setNotifications={setNotifications} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage modalMode={modalMode} setModalMode={setModalMode} />} />
          <Route path="/create" element={<CreateProductPage addNotification={addNotification} />} />
        </Routes>
      </main>
      <footer>
        <h2>footer</h2>
      </footer>
    </div>
  )
}

function NotificationManager({ notifications, setNotifications }) {
  // const [notifications, setNotifications] = useState([]);

  // function addNotification(message, type = "success") {
  //   const newToast = {
  //     id: crypto.randomUUID(),
  //     message,
  //     type
  //   };

  //   setNotifications(old => [...old, newToast]);
  // }

  function removeNotification(id) {
    setNotifications(old => old.filter(toast => toast.id !== id));
  }

  return (
    <div className="toast-container" popover="manual">
      {notifications.map(toast => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onDismiss={() => removeNotification(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastNotification({ toast, onDismiss }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`toast-box ${toast.type}`}>
      <p>{toast.message}</p>
      <button 
        type="button" 
        onClick={onDismiss} 
        aria-label="Dismiss alert"
      >
        x
      </button>
    </div>
  );
}

export default App;