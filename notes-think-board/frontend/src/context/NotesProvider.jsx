import { createContext, useCallback, useContext, useState } from "react";

const NotesContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notes, setNotes] = useState(null);

    return (
        <NotesContext.Provider value={{  }}>
            {children}
        </NotesContext.Provider>
    );
}

export const useNotify = () => useContext(NotesContext);