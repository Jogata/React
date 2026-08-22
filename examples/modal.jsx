<Modal isModalOpen={isModalOpen} setModalMode={setModalMode} onClose={closeModal} title={"Edit product"}>
    {isModalOpen ? <form className="modal-form centered"
        onSubmit={(e) => handleUpdateProduct(e, id, editedProduct)}
    >
        <input
            className="form-input"
            name="name"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            placeholder="Product Name"
        />
        <input
            className="form-input"
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
            placeholder="Price"
        />
        <input
            className="form-input"
            name="image"
            value={editedProduct.image}
            onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
            placeholder="Image URL"
        />

        <button className="btn">
            Edit Product
        </button>
    </form> : null}
</Modal>

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