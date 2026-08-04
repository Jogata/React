import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// import { Link, useLocation } from "react-router-dom";

const HomePage = () => {
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const abortControllerRef = useRef(null);
    // const location = useLocation();

    // if (location.state?.product) {
    //     console.log(location.state.product);
    // } else {
    //     console.log("no product in the location state");
    // }

    useEffect(() => {
        console.log("home / use effect / fetch products");

        loadProducts();

        async function loadProducts() {
            setLoading(true);
            try {
                const { products } = await getAllProducts();
                setProducts(products);
                setError(null);
                // setTimeout(() => {
                //     setProducts(products);
                //     setError(null);
                // }, 3000);
            } catch (err) {
                setError(err.message);
                // setTimeout(() => {
                //     setError(err.message);
                // }, 3000);
            } finally {
                setLoading(false);
                // if (!controller.signal.aborted) {
                //     setLoading(false);
                // }
            }
        }

        async function getAllProducts() {
            abortControllerRef.current = new AbortController();

            const response = await fetch("http://localhost:5000/api/products", {
                signal: abortControllerRef.current.signal
            });
            const contentType = response.headers.get("content-type");
        
            if (!response.ok) {
                let errorMessage = "An error occurred";

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    errorMessage = await response.text();
                }
                
                throw new Error(errorMessage);
            }
        
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                console.log(result);

                return {
                    products: result.data
                };
            }
        
            throw new Error("Invalid response format received from server");
        }

        return () => {
            abortControllerRef.current?.abort();
        }
    }, []);

    if (error) {
        return (
            <header className="main-header">
                <h1>{error}</h1>
            </header>
        )
    }

    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    async function deleteProduct(pid) {
        // pid = 1;
        const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Deletion failed";

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

    async function handleDeleteProduct(pid) {
        try {
            await deleteProduct(pid);
            setProducts(prevProducts => prevProducts.filter(p => p._id !== pid));
            setNotifications([{message: `Product ${pid} deleted`, type: "success"}]);
        } catch (err) {
            // setError(err.message);
            setNotifications([{message: err.message, type: "error"}]);
        }
    }

    async function updateProduct(pid, updatedProduct) {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct),
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
                const updatedProducts = products.map(product => product._id !== pid ? result.data : product);
                setProducts(filteredProducts);
            } 
    
            if (!result.success) return { success: false, message: result.message };
        
            return { success: true, message: data.message };                
        } catch (error) {
            
        }
	}

    return (
        <>
            {notifications.length > 0 ? (
                <Notifications notifications={notifications} />
            ) :
                null
            }

            {products.length === 0 ? (
                <header className="main-header">
                    <h1>No products found</h1>
                    <Link
                        to="/create"
                        className="redirect-link"
                    >
                        Create a product
                    </Link>
                </header>
            ) : (
                <ProductsSection
                    products={products}
                    handleDeleteProduct={handleDeleteProduct}
                />
            )}
        </>
    );
};

function ProductsSection({ products, handleDeleteProduct }) {
    return (
        <>
            <header className="main-header">
                <h1>Current Products</h1>
            </header>
            <div className="main-body">
                <section className="section">
                    <div className="products">
                        {products.map(product => (
                            <ProductCard 
                                key={product._id} 
                                product={product} 
                                handleDeleteProduct={handleDeleteProduct} 
                            />
                        ))}
                    </div>
                </section>
            </div>
            <Links products={products} />
        </>
    )
}

function ProductCard({ product, handleDeleteProduct }) {
    return (
        <article className="product-card">
            <img src={product.image} alt={product.name} />

            <div className="body">
                <header>
                    <h2>{product.name}</h2>
                </header>
                <h3 className="price">${product.price}</h3>

                <div className="actions">
                    <button
                        type="button"
                        className="icon edit-btn"
                        title="Edit"
                    >
                        <span className="sr-only">Edit product {product.name}</span>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                    <button
                        type="button"
                        className="icon delete-btn"
                        title="Delete"
                        onClick={() => handleDeleteProduct(product._id)}
                    >
                        <span className="sr-only">Delete product {product.name}</span>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </article>
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

// const HomePageWithAbortController = () => {
//     const [products, setProducts] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const controller = new AbortController();

//         async function getAllProducts(signal) {
//             const response = await fetch("http://localhost:5000/api/products", { signal });
//             const contentType = response.headers.get("content-type");
        
//             if (!response.ok) {
//                 let errorMessage = "An error occurred";
//                 if (contentType && contentType.includes("application/json")) {
//                     const errorData = await response.json();
//                     errorMessage = errorData.message || errorMessage;
//                 } else {
//                     errorMessage = await response.text();
//                 }
//                 throw new Error(errorMessage);
//             }
        
//             if (contentType && contentType.includes("application/json")) {
//                 const result = await response.json();
//                 return { products: result.data };
//             }
        
//             throw new Error("Invalid response format received from server");
//         }

//         async function loadProducts() {
//             setLoading(true);
//             try {
//                 const { products } = await getAllProducts(controller.signal);
//                 setProducts(products);
//             } catch (err) {
//                 if (err.name === 'AbortError') {
//                     console.log("Fetch successfully cancelled.");
//                     return; 
//                 }
//                 setError(err.message);
//             } finally {
//                 if (!controller.signal.aborted) {
//                     setLoading(false);
//                 }
//             }
//         }

//         loadProducts();

//         return () => {
//             controller.abort();
//         };
//     }, []);

//     return <h1>Home page</h1>;
// };

const HomePageWithAbortController = () => {
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchControllerRef = useRef(null);
    const deleteControllerRef = useRef(null);

    useEffect(() => {
        fetchControllerRef.current = new AbortController();

        async function loadProducts() {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/api/products", {
                    signal: fetchControllerRef.current.signal
                });
                
                if (!response.ok) throw new Error("Fetch failed");
                const result = await response.json();
                setProducts(result.data);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err.message);
            } finally {
                if (!fetchControllerRef.current?.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            fetchControllerRef.current?.abort();
        };
    }, []);

    async function deleteProduct(pid) {
        if (deleteControllerRef.current) {
            deleteControllerRef.current.abort();
        }
        
        deleteControllerRef.current = new AbortController();

        try {
            const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
                method: "DELETE",
                signal: deleteControllerRef.current.signal
            });

            if (!response.ok) throw new Error("Delete failed");
            
            setProducts(prev => prev.filter(p => p._id !== pid));
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log("Delete request was cancelled by a newer action.");
                return;
            }
            setError(err.message);
        }
    }

    useEffect(() => {
        return () => {
            fetchControllerRef.current?.abort();
            deleteControllerRef.current?.abort();
        };
    }, []);

    return <h1>Home page</h1>;
};

function Links({products}) {
    return (
        <div className="links">
            {products.map(product => (
                <Link key={product._id} to={`product/${product._id}`}>
                    {product.name}
                </Link>
            ))}
        </div>
    )
}

export default HomePage;