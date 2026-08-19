import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNotify } from "../../context/NotificationProvider";

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const HomePage = () => {
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {addNotification} = useNotify();
    const abortControllerRef = useRef(null);

    useEffect(() => {
        loadProducts();

        async function loadProducts() {
            setLoading(true);
            try {
                const { products } = await getAllProducts();
                setProducts(products);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
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
            addNotification(`Product ${pid} deleted`);
        } catch (err) {
            // setError(err.message);
            addNotification(err.message, "error");
        }
    }

    async function updateProduct(pid, updatedProduct) {
            const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct),
            });

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

    async function handleUpdateProduct(pid, updatedProduct) {
        try {
            await updateProduct(pid, updatedProduct);
            // setProducts(prevProducts => prevProducts.filter(p => p._id !== pid));
            const updatedProducts = products.map(product => product._id !== pid ? result.data : product);
            setProducts(updatedProducts);
            addNotification(`Product ${pid} updated`);
        } catch (err) {
            // setError(err.message);
            addNotification(err.message, "error");
        }
    }

//     class RequestManager {
//         constructor() {
//             this.controllers = new Map()
//         }

//         async fetch(key, url, options = {}) {
//             this.cancel(key);

//             const controller = new AbortController();
//             this.controllers.set(key, controller);

//             try {
//                 const response = await fetch(url, {
//                     ...options,
//                     signal: controller.signal
//                 })

//                 return response;
//             } finally {
//                 this.controllers.delete(key);
//             }
//         }

//         cancel(key) {
//             const controller = this.controllers.get(key);

//             if (controller) {
//                 controller.abort();
//                 this.controllers.delete(key);
//             }
//         }

//         cancelAll() {
//             for (const controller of this.controllers.values()) {
//                 controller.abort();
//             }
//             this.controllers.clear();
//         }
//     }

// const requestManager = new RequestManager();

// requestManager.fetch("user-profile", "/api/user/123");
// requestManager.fetch("user-posts", "/api/user/123/posts");

// requestManager.cancel("user-profile");

// requestManager.cancelAll();

    return (
        <>
            {/* {notifications.length > 0 ? (
                <Notifications notifications={notifications} />
            ) :
                null
            } */}

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
                    handleUpdateProduct={handleUpdateProduct}
                />
            )}
        </>
    );
};

function ProductsSection({ products, handleDeleteProduct, handleUpdateProduct }) {
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
                                handleUpdateProduct={handleUpdateProduct}
                            />
                        ))}
                    </div>
                </section>
            </div>
            <Links products={products} />
        </>
    )
}

function ProductCard({ product, handleDeleteProduct, handleUpdateProduct }) {
    return (
        <article className="product-card">
            <img src={product.image} alt={product.name} />

            <div className="content">
                <h2>{product.name}</h2>
                <data className="price" value={product.price}>${product.price}</data>
            </div>

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

            <footer className="metadata">
                <p>{formatDate(new Date(product.createdAt))}</p>
            </footer>
        </article>
    );
};


function ProductList({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const { addNotification } = useNotify();

  const handleDelete = async (productId, productName) => {
    const originalProducts = [...products];

    setProducts(prev => prev.filter(p => p.id !== productId));

    try {
      await fetch(`/api/products/${productId}/delete`, { method: "PATCH" });

      addNotification(
        `"${productName}" was deleted.`, 
        "neutral", 
        {
          label: "Undo",
          onClick: () => handleUndo(productId, originalProducts)
        }
      );
    } catch (err) {
      setProducts(originalProducts);
      addNotification("Failed to delete product.", "error");
    }
  };

  const handleUndo = async (productId, originalProducts) => {
    try {
      await fetch(`/api/products/${productId}/undo`, { method: "POST" });
      
      setProducts(originalProducts);
    } catch (err) {
      addNotification("Could not undo deletion. The time frame expired.", "error");
    }
  };

  return (
    <div>
      {products.map(product => (
        <div key={product.id} className="product-row">
          <span>{product.name}</span>
          <button onClick={() => handleDelete(product.id, product.name)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
    const timeoutController = new AbortController();

    const timeoutId = setTimeout(() => {
        timeoutController.abort();
    }, timeoutMs);

    const signals = [timeoutController.signal];

    if (options.signal) {
        signals.push(options.signal);
    }

    const combinedSignal = AbortSignal.any(signals);

    const response = await fetch(url, {
        ...options,
        signal: combinedSignal
    });
    
    clearTimeout(timeoutId);

    return response;
}

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

function Header({ title, as: HeadingTag = "h2", children }) {
    if (children) {
        return (
            <header className={`${HeadingTag}-header`}>
                <HeadingTag>{title}</HeadingTag>
                {children}
            </header>
        );
    }

    return <HeadingTag>{title}</HeadingTag>;
}

export default HomePage;