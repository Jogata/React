function Modal({ isModalOpen, setModalMode, onClose, title, children }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialogNode = dialogRef.current;
        if (!dialogNode) return;

        if (isModalOpen) {
            dialogNode.showModal();
            setModalMode(true);
        } else {
            dialogNode.close();
            setModalMode(false);
        }

        return () => {
            setModalMode(false);
        };
    }, [isModalOpen]);

    return (
        <dialog
            className="modal"
            ref={dialogRef}
            onClose={onClose}
            onClick={onClose}
        >
            <header>
                <button type="button" className="icon" onClick={onClose}>
                    <span className="sr-only">Close Modal</span>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
                <h2 id="modal-title">{title}</h2>
            </header>

            <div className="modal-body" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </dialog>
    );
}