import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotify } from "../../context/NotificationProvider";

export function ProductPage({ setModalMode }) {
    const [product, setProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addNotification } = useNotify();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("ProductPage / use effect / fetch products");
        getAllProducts().then(result => {
            const product = result.data.find(product => product._id == id);
            console.log(product);

            if (!product) {
                const customError = new Error("Product not found");
                customError.status = "404";
                throw customError;
            }

            setProduct(product);
        })
        .catch(err => {
            console.log(err.message);
            console.log(err.status);
            setError(err.message);
        })

        async function getAllProducts() {
            try {
                const response = await fetch("http://localhost:5000/api/products");

                const contentType = response.headers.get("content-type");
                let result = null;

                if (contentType && contentType.includes("application/json")) {
                    result = await response.json();
                    console.log(result);
                } else {
                    result = await response.text();
                }

                if (!response.ok) {
                    const message = typeof result === "object" ? result.message : result;
                    const customError = new Error(response.message);
                    customError.status = response.status;
                    throw customError;
                }

                return result;
            } catch (error) {
                // console.log(error.message);
                // console.log(error.status);
                throw error;
                // throw new Error("Unable to establish communication with the product catalog.", { cause: error });
            }
        }
    }, [id]);

    async function deleteProduct(pid) {
        pid = "6a8035aec850cd3671afad7a";
        try {
            const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
                method: "DELETE",
            });

            let result = null;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                result = await response.text();
            }

            if (!response.ok) {
                addNotification(result.message, "error");
            } else {
                addNotification(`Product ${pid} deleted`);
                navigate("/");
            }
        } catch (error) {
            setError(result);
        }
    }

    if (error) {
        return (
            <header className="main-header">
                <h1>{error}</h1>
            </header>
        )
    }

    if (!product) {
        return (
            <p>Loading...</p>
        )
    }

    async function updateProduct(pid, editedProduct) {
        const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedProduct),
        });
        console.log(response);

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Update failed";
            let errors = ["Update failed"];

            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                // console.log(errorData);
                errorMessage = "Form validation failed";
                errors = errorData.errors || errors;
            } else {
                errors[0] = await response.text();
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            error.errors = errors;
            
            throw error;
        }
    
        const result = await response.json();

        return result;
    }
    
    async function handleUpdateProduct(e, pid, editedProduct) {
        // pid = "1";
        // pid = "6a7830fe90b4c7c19d5d0964";
        e.preventDefault();

        if (!editedProduct.name || !editedProduct.image || !editedProduct.price) {
            addNotification("Please fill in all fields.", "error");
            return;
        }

        try {
            const response = await updateProduct(pid, editedProduct);
            setProduct(response.data);
            addNotification(`Product ${pid} updated`);
            closeModal();
        } catch (err) {
            console.log(err.status, err.errors);
            // const keys = Object.keys(err.errors);
            // console.log(keys);
            // keys.forEach(key => {
            //     console.log(key);
            //     addNotification(err.errors[key], "error")
            // });
            err.errors.forEach(error => {
                addNotification(error.message, "error");
            })
        }
    }

    function openModal(e) {
        setIsModalOpen(true);
        setEditedProduct({...product});
    }

    function closeModal() {
        setIsModalOpen(false);
    }
        
    return (
        <>
            <div className="product-page">
                <img src={product.image} alt={product.name} />
                <h1>{product.name}</h1>
                <h2>${product.price}</h2>
                <div className="actions">
                    <button
                        type="button"
                        className="icon edit-btn"
                        title="Edit"
                        onClick={openModal}
                    >
                        <span className="sr-only">Edit product {product.name}</span>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                    <button
                        type="button"
                        className="icon delete-btn modal-btn"
                        title="Delete"
                        onClick={() => deleteProduct(product._id)}
                    >
                        <span className="sr-only">Delete product {product.name}</span>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

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

            {/* {isModalOpen ? (
                <div 
                    className="modal" 
                    role="dialog" 
                    aria-modal="true" 
                    aria-labelledby="modal-title" 
                    onClick={closeModal}
                >
                    <header>
                        <button>
                            close
                            <i className="fa fa-times"></i>
                        </button>
                        <h1 id="modal-title">Title</h1>
                    </header>
                    <form className="form centered" 
                        onSubmit={(e) => handleUpdateProduct(e, id, editedProduct)} 
                        onClick={e => e.stopPropagation()}
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
                    </form>
                </div>
            ) : null} */}
        </>
    );
};

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

export default ProductPage;