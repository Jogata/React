import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/pages/Home";
import CreateProductPage from "./components/pages/CreateProductPage";
import ProductPage from "./components/pages/ProductPage";
import { NotificationProvider } from "./context/NotificationProvider";

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
    <NotificationProvider>
      <div className={pageClass}>
        <Navbar toggleTheme={toggleTheme} colorMode={colorMode} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage modalMode={modalMode} setModalMode={setModalMode} />} />
            <Route path="/products/:id" element={<ProductPage modalMode={modalMode} setModalMode={setModalMode} />} />
            <Route path="/create" element={<CreateProductPage />} />
          </Routes>
        </main>
        <footer>
          <h2>footer</h2>
        </footer>
      </div>
    </NotificationProvider>
  )
}

// function NotificationManager({ notifications, removeNotification }) {
//   const popoverRef = useRef(null);

//   useEffect(() => {
//     const popoverNode = popoverRef.current;
//     if (!popoverNode) return;

//     if (notifications.length > 0) {
//       popoverNode.showPopover();
//     } else {
//       popoverNode.hidePopover();
//     }
//   }, [notifications.length]);

//   return (
//     <div className="toast-container" ref={popoverRef} popover="manual">
//       {notifications.map(toast => (
//         <ToastNotification
//           key={toast.id}
//           toast={toast}
//           onDismiss={removeNotification}
//         />
//       ))}
//     </div>
//   );
// }

// function ToastNotification({ toast, onDismiss }) {

//   useEffect(() => {
//     console.log(toast.id);
//     const timer = setTimeout(() => {
//       onDismiss(toast.id);
//     }, 30000);

//     return () => clearTimeout(timer);
//   }, [toast]);

//   return (
//     <div className={`toast-box ${toast.type}`}>
//       <p>Toast</p>
//       <button 
//         type="button" 
//         onClick={() => onDismiss(toast.id)} 
//         aria-label="Dismiss alert"
//       >
//         <span>X</span>
//       </button>
//     </div>
//   );
// }

export default App;