import { createContext, useState } from "react";

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

export const useNotify = () => useContext(NotificationContext);