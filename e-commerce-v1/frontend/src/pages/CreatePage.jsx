import { useState } from "react";

const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
		name: "",
		price: null,
		image: "",
	});

    return (
        <form>
            <h1>Create New Product</h1>
            <input
                name="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Product Name"
            />
            <input
                name="price"
                type="number"
                min={0}
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
            <button>Add Product</button>
        </form>
    );
};

export default CreatePage;