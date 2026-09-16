import { createContext, useCallback, useContext, useState } from "react";

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
        </NotificationContext.Provider>
    );
}

export const useNotify = () => useContext(NotificationContext);