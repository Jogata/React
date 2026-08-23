import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modalMode, setModalMode] = useState(false);
        
    return (
        <ModalContext.Provider value={{ modalMode, setModalMode }}>
            {children}
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);