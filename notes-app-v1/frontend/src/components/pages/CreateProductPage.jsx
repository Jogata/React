import { useState } from "react";
import { useNotify } from "../../context/NotificationProvider";

function CreateProductPage() {
    const [newProduct, setNewProduct] = useState({
        name: "test1",
        price: "55",
        image: "https://cdn.pixabay.com/photo/2016/11/21/13/58/analog-watch-1845547_1280.jpg",
    });
    const [ error, setError ] = useState(null);
    const { addNotification } = useNotify();

    if (error) {
        return (
            <header className="main-header">
                <h1>{error}</h1>
            </header>
        )
    }

    async function createProduct(newProduct) {
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
            result = await response.json();
        } else {
            result = await response.text();
        }

        if (!response.ok) {
            const customError = new Error(result.message);
            customError.status = response.status;
            throw customError;
        }

        console.log("Product created successfully");
        // console.log(result);
        return result;
    }

    async function handleCreateProduct1(e) {
        e.preventDefault();

        if (!newProduct.name || !newProduct.image || !newProduct.price) {
            addNotification("Please fill in all fields.", "error");
            return;
        }

        try {
            const response = await createProduct(newProduct);

            console.log("Product created successfully", response);
            // addNotification("Product created successfully");
            addNotification(`Product ${response.data.name} created successfully`);
        } catch (error) {
            // setError(error.message);
            console.log(error.message);
            addNotification(error.message, "error");
        }
    }

    return (
        <>
            <header className="main-header">
                <h1>Create New Product</h1>
            </header>

            <form className="form centered" onSubmit={handleCreateProduct1}>
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

async function request(url, options = {}) {
  const headers = { ...options.headers };

  const isInternalRequest = url.startsWith("/") || url.includes("your-api-domain.com");

  if (isInternalRequest) {
    const token = localStorage.getItem("token");
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (options.body && typeof options.body === "object") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, { ...options, headers });
  return handleResponse(response);
}

async function handleResponse(response) {
    const contentType = response.headers.get("content-type");
    let data;
  
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  
    if (!response.ok) {
      const errorMessage = data?.message || data || "Network response was not ok";
      throw new Error(errorMessage);
    }
  
    return data;
}

export default CreateProductPage;