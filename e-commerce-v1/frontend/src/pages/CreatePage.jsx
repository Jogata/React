import { useState } from "react";

const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
		name: "test2",
		price: "6",
		image: "test2",
	});

    const createProduct = async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price) {
            console.log("fill all");
			return { success: false, message: "Please fill in all fields." };
		}

		const res = await fetch("http://localhost:5000/products", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newProduct),
		});

		const data = await res.json();
        console.log(data);

        return { success: true, message: "Product created successfully" };
	}

    const handleSubmitForm = (e) => {
        e.preventDefault();
        console.log("submitted");
        createProduct(newProduct);
    }

    return (
        <form onSubmit={handleSubmitForm}>
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