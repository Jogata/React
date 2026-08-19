import { useState } from "react";
// import { useNotify } from "../../context/NotificationProvider";

export function Form() {
    const [newProduct, setNewProduct] = useState({
        name: "test1",
        price: "55",
        image: "https://cdn.pixabay.com/photo/2016/11/21/13/58/analog-watch-1845547_1280.jpg",
    });
    const [ error, setError ] = useState(null);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    // const { addNotification } = useNotify();

    if (error) {
        return (
            <header className="main-header">
                <h1>{error}</h1>
            </header>
        )
    }

    return (
        <>
            <header className="main-header" id="form-title">
                <h1>Create New Product</h1>
            </header>

            <form
                className="form centered"
                aria-labelledby="form-title"
                onSubmit={handleCreateProduct}
            >
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

                <button className="btn" aria-disabled={isSubmitting}>
                    Add Product
                </button>
            </form>
        </>
    )
}