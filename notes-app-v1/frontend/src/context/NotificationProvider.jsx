import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

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

function Notifications({ notifications, removeNotification }) {
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

  return (
    <div className="toast-container" ref={popoverRef} popover="manual" role="status">
      {notifications.map(toast => (
        <Notification key={toast.id} toast={toast} onDismiss={removeNotification} />
      ))}
    </div>
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