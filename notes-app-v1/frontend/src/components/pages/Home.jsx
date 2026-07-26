import { useEffect } from "react";
import { useState } from "react";

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
        <h1>{products[0].name}</h1>
	);
};

export default HomePage;