import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("home / use effect / fetch products");
        getAllProducts();

        async function getAllProducts() {
            const response = await fetch("http://localhost:5000/api/products");

            if (!response.ok) {
                setError("Custom error");
            }

            const contentType = response.headers.get("content-type");
            let result = null;

            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
                setProducts(result.data);
                // setProducts([]);
            } else {
                result = await response.text();
                setError(result);
            }
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
        pid = "6a69f1a10fff8ba99d2eeef1";
        try {
            const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
                method: "DELETE",
            });
            // console.log(response);
    
            let result = null;
            const contentType = response.headers.get("content-type");
    
            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                result = await response.text();
                // setError(result);
            }

            console.log(result);
    
            if (!response.ok) {
                // setError("Network error");
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
                        className="icon edit-btn"
                        title="Edit"
                    >
                        Edit
                        <i className="fa fa-pencil-square-o"></i>
                    </button>
                    <button
                        className="icon delete-btn"
                        title="Delete"
                        onClick={() => deleteProduct(product._id)}
                        // onClick={() => deleteProduct(1)}
                    >
                        Delete
                        <i className="fa fa-trash-o"></i>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default HomePage;