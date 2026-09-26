import { useState } from "react";

function useModal() {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    // const [ note, setNote ] = useState(null);
    
    // const setModalMode = () => console.log("todo setModalMode");
    
    function openModal() {
        setIsModalOpen(true);
    }
    
    function closeModal() {
        setIsModalOpen(false);
    }

    return {
        isModalOpen, 
        openModal, 
        closeModal
    }
}

export default useModal;