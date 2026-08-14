import { Route, Routes } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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

  function removeNotification(id) {
    setNotifications(old => old.filter(toast => toast.id !== id));
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
      <NotificationManager notifications={notifications} removeNotification={removeNotification} />
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

function NotificationManager({ notifications, removeNotification }) {
  const popoverRef = useRef(null);

  useEffect(() => {
    const popoverNode = popoverRef.current;
    if (!popoverNode) return;

    if (notifications.length > 0) {
      popoverNode.showPopover();
    } else {
      popoverNode.hidePopover();
    }
  }, [notifications.length]);

  // function removeNotification(id) {
  //   setNotifications(old => old.filter(toast => toast.id !== id));
  // }

  return (
    <div className="toast-container" ref={popoverRef} popover="manual">
      {notifications.map(toast => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          // onDismiss={() => removeNotification(toast.id)}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  );
}

function ToastNotification({ toast, onDismiss }) {
  // console.log(toast);

  useEffect(() => {
    console.log(toast.id);
    // console.log("------------------");
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 30000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className={`toast-box ${toast.type}`}>
      {/* <p>{toast.message}</p> */}
      <p>Toast</p>
      <button 
        type="button" 
        // onClick={onDismiss} 
        onClick={() => onDismiss(toast.id)} 
        aria-label="Dismiss alert"
      >
        <span>X</span>
      </button>
    </div>
  );
}

export default App;