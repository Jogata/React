import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("home / use effect / fetch products");
        getAllProducts();
        // const prom = getAllProducts();
        // console.log(prom);

        async function getAllProducts() {
            const response = await fetch("http://localhost:5000/api/products");
            // console.log(response);

            if (!response.ok) {
                setError("Network error");
            }

            const contentType = response.headers.get("content-type");
            // console.log(contentType);
            let result = null;

            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
                // console.log(result);
                setProducts(result.data);
                setProducts([]);
            } else {
                result = await response.text();
                setError(result);
            }

            // console.log(result);
        }
    }, []);

    // console.log("products", products);

    if (error) {
        return (
            <h1>{error}</h1>
        )
    }

    if (!products) {
        return (
            <p>Loading...</p>
        )
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
                <>
                    <header className="main-header">
                        <h1>Current Products</h1>
                    </header>
                    <div className="main-body">
                        <section className="main-section">
                            {products.map(product => (
                                // <h2 key={product._id}>{product.name}</h2>
                                <ProductCard product={product} />
                            ))}
                        </section>
                    </div>
                </>
            )}
        </>
    );
};

const ProductCard = ({ product }) => {
    return (
        <article>
            <img src={product.image} alt={product.name} />

            <div>
                <header>
                    <h2>{product.name}</h2>
                </header>
                <h3>${product.price}</h3>

                <div>
                    <Link
                        to={`/edit/${product._id}`}
                        className="icon"
                        title="Edit"
                    >
                        Edit
                        <i className="fa fa-pencil-square-o"></i>
                    </Link>
                    <button
                        className=""
                        title="Delete"
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