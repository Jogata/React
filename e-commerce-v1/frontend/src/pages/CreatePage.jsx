import { useEffect, useRef, useState } from "react";

const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
		name: "",
		price: "",
        image: ""
	});
    const [loading, setLoading] = useState(false);

    // todelete
    useEffect(() => {
        setNewProduct({
            name: "test4",
            price: "4",
            image: "https://cdn.pixabay.com/photo/2016/11/21/13/58/analog-watch-1845547_1280.jpg"
        })
    }, [])

    const controller = useRef(null);

    const createProduct = async (newProduct) => {
        if (loading) {
            console.log("do nothing");
            return;
        }

		if (!newProduct.name || !newProduct.image || !newProduct.price) {
            // console.log("fill all");
			return { success: false, message: "Please fill in all fields." };
		}

        if (controller.current) {
            controller.current.abort();
            controller.current = null;
        }

        try {
            setLoading(true);

            controller.current = new AbortController();

            const res = await fetch("http://localhost:5000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
                signal: controller.current.signal
            });
    
            const data = await res.json();
            console.log(data);
            controller.current = null;
            // setLoading(false);
    
            return { success: true, message: "Product created successfully" };    
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Fetch request was canceled");
            } else {
                console.error("Fetch error:", error);
            }
            // setLoading(false);
        } finally {
            if (!controller.current) {
                setLoading(false);
            }
        }
	}

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        // console.log("submitted");
        const result = await createProduct(newProduct);
        console.log(result);
        if (result.success) {
            setNewProduct({
                name: "",
                price: "",
                image: "",        
            });
        }
    }

    const buttonText = loading ? "Creating..." : "Add Product";

    useEffect(() => {
        return () => {
            if (controller.current) {
                controller.current.abort();
            }
        };
    }, [controller])

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
            <button>
                {/* Add Product */}
                {buttonText}
            </button>
        </form>
    );
};

export default CreatePage;