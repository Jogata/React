import { useState } from "react";

function CreateProductPage() {
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "https://cdn.pixabay.com/photo/2016/11/21/13/58/analog-watch-1845547_1280.jpg",
    });

    async function createProduct() {
        console.log("todo create product");
    }

    return (
        <>
            <header className="page-header">
                <h1>Create New Product</h1>
            </header>

            <form>
                <input
                    name="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Product Name"
                />
                <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Price"
                />
                <input
                    name="image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="Image URL"
                />

                <button onClick={createProduct}>
                    Add Product
                </button>
            </form>
        </>
    );
};

export default CreateProductPage;