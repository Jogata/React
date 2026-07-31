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
    }, []);

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

    return (
        // <h1>Product page {id}</h1>
        <div className="product-page">
            <img src={product.image} alt={product.name} />
            <h1>{product.name}</h1>
            <h2>${product.price}</h2>
            <div className="actions">
                {/* <button
                    className="icon edit-btn"
                    title="Edit"
                >
                    Edit product
                    <i className="fa fa-pencil-square-o"></i>
                </button> */}
                <button 
                    type="button"
                    className="icon edit-btn" 
                    title="Edit"
                >
                    <span className="sr-only">Edit product {product.name}</span>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>
                <button
                    className="icon delete-btn"
                    title="Delete"
                    // onClick={() => deleteProduct(product._id)}
                >
                    Delete
                    <i className="fa fa-trash-o"></i>
                </button>
            </div>
        </div>
    );
};

export default ProductPage;