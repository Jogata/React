import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const HomePage = () => {
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();

    if (location.state?.product) {
        console.log(location.state.product);
    }

    useEffect(() => {
        console.log("home / use effect / fetch products");
        // getAllProducts();

        // async function getAllProducts() {
        //     const response = await fetch("http://localhost:5000/api/products");

        //     if (!response.ok) {
        //         setError("Custom error");
        //     }

        //     const contentType = response.headers.get("content-type");
        //     let result = null;

        //     if (contentType && contentType.includes("application/json")) {
        //         result = await response.json();
        //         setProducts(result.data);
        //     } else {
        //         result = await response.text();
        //         setError(result);
        //     }
        // }

        loadProducts();

        async function loadProducts() {
            try {
                const { products } = await apiGetAllProducts();
                setProducts(products);
            } catch (err) {
                setError(err.message);
            }
        }

        async function apiGetAllProducts() {
            const response = await fetch("http://localhost:5000/api/products");
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
    }, []);

    if (error) {
        return (
            <header className="main-header">
                <h1>{error}</h1>
            </header>
        )
    }

    if (!products) {
        return (
            <p>Loading...</p>
        )
    }

    async function deleteProduct(pid) {
        // pid = "6a69f1a10fff8ba99d2eeef1";
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

            // console.log(result);
    
            if (!response.ok) {
                setError(result.message);
                setTimeout(() => {
                    setError(null);
                }, 3000);
            } else {
                const filteredProducts = products.filter(product => product._id !== pid);
                setProducts(filteredProducts);
            }    
        } catch (error) {
            setError(result);
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
                <ProductsSection products={products} deleteProduct={deleteProduct} />
            )}
        </>
    );
};

function ProductsSection({ products, deleteProduct }) {
    return (
        <>
            <header className="main-header">
                <h1>Current Products</h1>
            </header>
            <div className="main-body">
                <section className="section">
                    <div className="products">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} deleteProduct={deleteProduct} />
                        ))}
                    </div>
                </section>
            </div>
            <Links products={products} />
        </>
    )
}

function ProductCard({ product, deleteProduct }) {
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
                        onClick={() => deleteProduct(product._id)}
                    >
                        {/* Delete */}
                        <span className="sr-only">Delete product {product.name}</span>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </article>
    );
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