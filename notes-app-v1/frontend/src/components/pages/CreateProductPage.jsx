import { useState } from "react";

function CreateProductPage({ addNotification }) {
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
        if (!newProduct.name || !newProduct.image || !newProduct.price) {
            // console.log("Please fill in all fields.");
            addNotification("Please fill in all fields.", "error");
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
                // addNotification({type: "success", message: "Product created successfully"});
                // return { success: true, message: "Product created successfully" };
            } else {
                result = await response.text();
                // setError(result);
            }

            if (!response.ok) {
                if (response.status == 409) {
                    console.log(result.message);
                    addNotification(result.message, "error");
                    return { success: false, message: result.message };
                }
                // setError("Custom error");
            }

            console.log("Product created successfully");
            addNotification("Product created successfully");
            return { success: true, message: "Product created successfully" };
        } catch (error) {
            setError(error.message);
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

            <DevButton setNewProduct={setNewProduct} />
        </>
    );
};

function ProductForm() {
    return (
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
    )
}

function DevButton({ setNewProduct }) {
    function generate() {
        setNewProduct(old => {
            const newProduct = { ...old };
            const number = Number(old.name[old.name.length - 1]);
            const newName = newProduct.name.substring(0, 4) + (number + 1);
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