import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("home use effect");
        getAllProducts();

        async function getAllProducts() {
            const response = await fetch("http://localhost:5000/api/products");
            console.log(response);

            if (!response.ok) {
                setError("Network error");
            }

            const contentType = response.headers.get("content-type");
            console.log(contentType);
            let result = null;

            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
                console.log(result);
                setProducts(result.data);
                // setProducts([]);
            } else {
                result = await response.text();
                setError(result);
            }

            console.log(result);
        }
    }, []);

    console.log("products", products);

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
        // <h1>{products[0].name}</h1>
        <>
            {products.length === 0 ? (
                <header className="main-header">
                    <h1>No products found</h1>
                    <Link to="/create">
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
                                <h2 key={product._id}>{product.name}</h2>
                            ))}
                        </section>
                    </div>
                </>
            )}
        </>
    );
};

export default HomePage;