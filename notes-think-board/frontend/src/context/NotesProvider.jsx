import { createContext, useCallback, useContext, useState } from "react";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState(null);

    // console.log("notes provider");

    function initializeNotes(notes) {
        setNotes(notes);
    }

    function addNote(note) {
        if (notes) {
            console.log(notes);
            setNotes(old => notes == null ? null : [...old, note]);
        } else {
            console.log(notes);
        }
    }

    function updateNote(updatedNote) {
        console.log(updatedNote._id);
        if (notes) {
            setNotes(old => old.map(note => note._id == updatedNote._id ? updatedNote : note));
        }
    }

    function deleteNote(id) {
        if (notes) {
            setNotes(old => old.filter(note => note._id !== id));
        }
    }

    const context = { 
        notes, 
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