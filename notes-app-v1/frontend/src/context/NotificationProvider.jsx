import { createContext, useContext, useEffect, useRef, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    function addNotification(message, type = "success") {
        const newToast = { id: crypto.randomUUID(), message, type };
        setNotifications(old => [...old, newToast]);
    }

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}

            <Notifications
                notifications={notifications}
                setNotifications={setNotifications}
            />
        </NotificationContext.Provider>
    );
}

function Notifications({ notifications, setNotifications }) {
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
    <div className="toast-container" ref={popoverRef} popover="manual">
      {notifications.map(toast => (
        <p className={`toast-box ${toast.type}`}>{toast.message}</p>
      ))}
    </div>
  );
}

export const useNotify = () => useContext(NotificationContext);