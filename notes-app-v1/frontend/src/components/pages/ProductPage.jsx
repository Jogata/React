import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ProductPage({ setModalMode }) {
    const [product, setProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        // pid = "6a6db517423ac20b02df6b8s";
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
                setError(result.message);
                setTimeout(() => {
                    setError(null);
                }, 3000);
            } else {
                console.log("navigate");
                navigate("/", {
                    state: { product: id },
                },);
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

    function openModal() {
        setModalMode(true);
        setIsModalOpen(true);
        setEditedProduct({...product});
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

            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            
            throw error;
        }
    
        const result = await response.json();

        return result;
    }
    
    async function handleUpdateProduct(e, pid, editedProduct) {
        pid = "1";
        pid = "6a7830fe90b4c7c19d5d0964";
        e.preventDefault();
        try {
            console.log("form sub");
            const response = await updateProduct(pid, editedProduct);
            console.log(response);
            // setProducts(prevProducts => prevProducts.filter(p => p._id !== pid));
            // setProducts(products => {
            //     const updatedProducts = products.map(product => product._id !== pid ? result.data : product);
            //     return updatedProducts;
            // });
            setNotifications([{message: `Product ${pid} updated`, type: "success"}]);
            // setIsModalOpen(false);
            closeModal();
            setProduct(response.data);
        } catch (err) {
            // setError(err.message);
            setNotifications([{message: err.message, type: "error"}]);
        }
    }

    function closeModal() {
        setModalMode(false);
        setIsModalOpen(false);
    }
        
    return (
        <>
            {notifications.length > 0 ? (
                <Notifications notifications={notifications} />
            ) :
                null
            }

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
                        className="icon delete-btn"
                        title="Delete"
                        onClick={() => deleteProduct(product._id)}
                    >
                        <span className="sr-only">Delete product {product.name}</span>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            {isModalOpen ? (
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
                    {/* <div className="overflow"> */}
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
                    {/* </div> */}
                </div>
            ) : null}
        </>
    );
};

function Notifications({notifications}) {
    return (
        <div className="notifications-section">
            <div className="body">
                {notifications.map((notification, index) => {
                    console.log(notification);
                    const notificationClassName = `notification ${notification.type}`;
                    return (
                        <div key={index} className={notificationClassName}>
                            {notification.message}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProductPage;