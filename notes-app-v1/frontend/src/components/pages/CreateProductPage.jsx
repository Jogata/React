import { useState } from "react";

function CreateProductPage() {
    const [newProduct, setNewProduct] = useState({
        name: "test1",
        price: "55",
        image: "https://cdn.pixabay.com/photo/2016/11/21/13/58/analog-watch-1845547_1280.jpg",
    });
    const [error, setError] = useState(null);

    if (error) {
        return (
            <header className="main-header">
                <h1>{error}</h1>
            </header>
        )
    }

    async function createProduct(e) {
        e.preventDefault();
        // console.log("todo create product");
        if (!newProduct.name || !newProduct.image || !newProduct.price) {
            console.log("Please fill in all fields.");
            return { success: false, message: "Please fill in all fields." };
        }

        try {
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });
    
            const contentType = response.headers.get("content-type");
            let result = null;
    
            if (contentType && contentType.includes("application/json")) {
                // console.log("created");
                result = await response.json();
                // return { success: true, message: "Product created successfully" };
            } else {
                result = await response.text();
                // setError(result);
            }
    
            if (!response.ok) {
                if (response.status == 409) {
                    console.log(result.message);
                    return { success: false, message: result.message };
                }
                // setError("Custom error");
            }
    
            console.log("Product created successfully");
            return { success: true, message: "Product created successfully" };    
        } catch (error) {
            setError(result);
        }
    }

    return (
        <>
            <header className="main-header">
                <h1>Create New Product</h1>
            </header>

            <form className="form centered" onSubmit={createProduct}>
                <input
                    className="form-input"
                    name="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Product Name"
                />
                <input
                    className="form-input"
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Price"
                />
                <input
                    className="form-input"
                    name="image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="Image URL"
                />

                <button className="btn">
                    Add Product
                </button>
            </form>

            <Button setNewProduct={setNewProduct} />
        </>
    );
};

function Button({setNewProduct}) {
    function generate() {
        setNewProduct(old => {
            const newProduct = {...old};
            const number = Number(old.name[old.name.length - 1]);
            // console.log(number);
            const newName = newProduct.name.substring(0,4) + (number + 1);
            newProduct.name = newName;
            return newProduct;
        })
    }

    return (
        <button 
            className="btn"
            onClick={generate}
        >
            generate
        </button>
    )
}

export default CreateProductPage;