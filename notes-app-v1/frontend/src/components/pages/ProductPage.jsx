import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function ProductPage() {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        console.log("ProductPage / use effect / fetch products");
        getAllProducts().then(result => {
            const product = result.data.find(product => product._id == id);
            console.log(product);
            setProduct(product);
        });
        // console.log(result);

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

                return result;
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

	return (
        <h1>Product page {id}</h1>
	);
};

export default ProductPage;