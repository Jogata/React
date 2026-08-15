import { createContext, useContext, useEffect, useRef, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    function addNotification(message, type = "success") {
        const newToast = { id: crypto.randomUUID(), message, type };
        setNotifications(old => [...old, newToast]);
    }

    // function removeNotification(id) {
    //     setNotifications(old => old.filter(toast => toast.id !== id));
    // }

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
        // <p className={`toast-box ${toast.type}`}>{toast.message}</p>
        <Notification key={toast.id} toast={toast} setNotifications={setNotifications} />
      ))}
    </div>
  );
}

function Notification({ toast, setNotifications }) {
    // console.log(toast);
    const id = toast.id;

    useEffect(() => {
        console.log(id);
        function removeNotification(id) {
            setNotifications(old => old.filter(toast => toast.id !== id));
        }

        const timer = setTimeout(() => {
            removeNotification(id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [setNotifications, id]);

    function onDismiss(id) {
        setNotifications(old => old.filter(toast => toast.id !== id));
    }

    return (
        <div className={`toast-box ${toast.type}`}>
            <p>{toast.message}</p>
            <button
                type="button"
                onClick={() => onDismiss(id)}
                aria-label="Dismiss alert"
            >
                x
            </button>
        </div>
    );
}

export const useNotify = () => useContext(NotificationContext);