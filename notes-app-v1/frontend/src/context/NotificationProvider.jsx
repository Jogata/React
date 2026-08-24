import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Notifications } from "../components/Notifications/Notifications";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = "success") => {
        const newToast = { id: crypto.randomUUID(), message, type };
        setNotifications(old => [...old, newToast]);
    }, []);
    
    const removeNotification = useCallback((id) => {
        setNotifications(old => old.filter(toast => toast.id !== id));
    }, []);
        
    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}

            <Notifications
                notifications={notifications}
                removeNotification={removeNotification}
            />
        </NotificationContext.Provider>
    );
}

function Notification({ toast, onDismiss }) {
  const [fadeout, setFadeout] = useState(false)
  const id = toast.id;

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeout(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [onDismiss, id]);

  // const accessibilityRole = toast.type === "error" ? "alert" : "status";
  const notificationClassName = fadeout ? `toast-box ${toast.type} fade-out` : `toast-box ${toast.type}`;

  return (
    // <div className={`toast-box ${toast.type}`} role={accessibilityRole}>
    <div className={notificationClassName} onAnimationEnd={() => onDismiss(id)}>
      <p>{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss alert"
      >
        <span>X</span>
      </button>
    </div>
  );
}

export const useNotify = () => useContext(NotificationContext);