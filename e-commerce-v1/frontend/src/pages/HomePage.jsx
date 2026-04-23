import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const HomePage = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// console.log("home use effect");
		const controller = new AbortController();
		getProducts();

		async function getProducts() {
			setLoading(true);

			try {
				const res = await fetch("http://localhost:5000/products", {
					signal: controller.signal
				});
				const data = await res.json();
				// console.log(data);
				setProducts(data.data);
				// setProducts([]);
				setLoading(false);
			} catch (error) {
				if (error.name === "AbortError") {
					console.log("Fetch request was canceled");
				} else {
					console.error("Fetch error:", error);
					setLoading(false);
				}
			}
		}

		return () => {
			controller.abort();
		}
	}, []);

	return (
		<>
			{loading ? 
				<Loader /> : 
				<Products 
					products={products} 
					setProducts={setProducts} 
				/>
			}
		</>
	)

};

const Products = ({ products, setProducts }) => {
	return (
		<>
			{products.length === 0 ? (
				<EmptyList />
			) : (
				<ProductsList 
					products={products} 
					setProducts={setProducts} 
				/>
			)}
		</>
	)
}

const EmptyList = () => {
	return (
		<div className="empty-list">
			<h1>No products found</h1>
			<Link to={"/create"}>
				Create a product
			</Link>
		</div>
	)
}

const ProductsList = ({ products, setProducts }) => {
	return (
		<section className="products-section">
			<h1>Products</h1>
			<div className="products">
				{products.map(product => (
					<Product 
						key={product._id} 
						product={product} 
						setProducts={setProducts} 
					/>
				))}
			</div>
		</section>
	)
}

const Product = ({ product, setProducts }) => {
	const controller = useRef(null);

	const handleDelete = async (id) => {
		controller.current = new AbortController();

		try {
			const response = await fetch(`http://localhost:5000/products/${id}`, {
				method: "DELETE",
				signal: controller.current.signal
			});

			const res = await response.json();
			// console.log(res);

			if (!res) {
				console.log("delete product fail");
			} else {
				setProducts(old => old.filter(p => p._id !== id))
			}
		} catch (error) {
			if (error.name === "AbortError") {
				console.log("Canceled an old request");
			} else {
				console.error("Problem with deleting", error);
			}
		}
	}

	useEffect(() => {
		// console.log("delete useEffect");
		return () => {
			if (controller.current) {
				controller.current.abort();
			}
		}
	}, [controller])

	return (
		<div className="product">
			<img src={product.image} alt="" />
			<div className="product-info">
				<h2>{product.name}</h2>
				<p className="price">
					${product.price.toFixed(2)}
				</p>
				<div className="actions">
					{/* <Link to="/create" className="edit">
						Edit product
						<i className="ri-edit-line"></i>
					</Link> */}
					<EditProductModalForm product={product} />
					<button className="delete" onClick={() => handleDelete(product._id)}>
						Delete product
						<i className="fa fa-trash-o"></i>
					</button>
				</div>
			</div>
		</div>
	)
}

// const EditProductModalForm = ({ book, onClose }) => {
const EditProductModalForm = ({ product }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const focusPoint = useRef(null);

    useEffect(() => {
        // console.log(focusPoint.current);
        if (focusPoint.current) {
            focusPoint.current.focus();
        }
    }, [focusPoint.current])

    return (
        <>
            <button 
				className="edit" 
				onClick={() => setIsModalOpen(true)} 
			>
				Edit product
				<i className="ri-edit-line"></i>
            </button>

            {isModalOpen ? (
                <Modal 
                    item={product} 
                    closeModal={() => setIsModalOpen(false)}
                />
            ) : null}
        </>
    );
};

const Modal = ({ item, closeModal }) => {
	const [product, setProduct] = useState({
		name: item.name,
		price: item.price,
        image: item.image
	});
    const focusPoint = useRef(null);

    useEffect(() => {
        // console.log(focusPoint.current);
        if (focusPoint.current) {
            focusPoint.current.focus();
        }
    }, [focusPoint.current])

    return (
        <div className="modal" onClick={closeModal}>
        <div
            className="modal-box update-form"
            onClick={(event) => event.stopPropagation()}
        >
			<form>
            <h2
                ref={focusPoint}
                tabIndex="-1"
            >
                Update product
            </h2>
			<input
                name="name"
                value={product.name}
                placeholder="Product Name"
            />
            <input
                name="price"
                type="number"
                min={0}
                value={product.price}
                placeholder="Price"
            />
            <input
                name="image"
                value={product.image}
                placeholder="Image URL"
            />
			</form>
            <button onClick={closeModal}>
                close
                <i className="ri-close-line"></i>
            </button>
        </div>
    </div>
    );
};

export default HomePage;