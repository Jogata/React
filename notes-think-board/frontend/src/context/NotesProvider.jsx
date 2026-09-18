import { createContext, useCallback, useContext, useState } from "react";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState(null);
        
    return (
        <NotesContext.Provider value={{ notes, setNotes }}>
            {children}
        </NotesContext.Provider>
    );
}

export const useNotes = () => useContext(NotesContext);