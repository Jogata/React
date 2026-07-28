import { useState } from "react";

function CreateProductPage() {
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "https://cdn.pixabay.com/photo/2016/11/21/13/58/analog-watch-1845547_1280.jpg",
    });

    async function createProduct(e) {
        e.preventDefault();
        console.log("todo create product");
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
        </>
    );
};

export default CreateProductPage;