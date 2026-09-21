import { createContext, useCallback, useContext, useState } from "react";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState(null);

    function initializeNotes(notes) {
        setNotes(notes);
    }

    function addNote(note) {
        setNotes(old => notes == null ? null : [...old, note]);
    }

    function updateNote(id) {
        setNotes(old => old.map(note => note._id !== id));
    }

    function deleteNote(id) {
        setNotes(old => old.filter(note => note._id !== id));
    }

    const context = { 
        notes, 
        // setNotes, 
        initializeNotes, 
        addNote, 
        updateNote, 
        deleteNote 
    };

    return (
        <NotesContext.Provider value={ context }>
            {children}
        </NotesContext.Provider>
    );
}

export const useNotes = () => useContext(NotesContext);