import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const HomePage = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		getProducts();

		async function getProducts() {
			setLoading(true);

			try {
				const res = await fetch("http://localhost:5000/products", {
					signal: controller.signal
				});
				const data = await res.json();
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
			{loading ? <Loader /> : <Products products={products} />}
		</>
	)

};

const Products = ({ products }) => {
	return (
		<>
			{products.length === 0 ? (
				<EmptyList />
			) : (
				<ProductsList products={products} />
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

const ProductsList = ({products}) => {
	return (
		<section className="products-section">
			<h1>Products</h1>
		<div className="products">
			{products.map(product => (
				<div className="product" key={product._id}>
					<img src={product.image} alt="" />
					<div className="product-info">
					<h2>{product.name}</h2>
					<p className="price">
						${product.price.toFixed(2)}
					</p>
					<div className="actions">
						<button className="edit">
							Edit product
							<i className="ri-edit-line"></i>
						</button>
						<button className="delete">
							Delete product
							<i className="fa fa-trash-o"></i>
						</button>
					</div>
					</div>
				</div>
			))}
		</div>
		</section>
	)
}

export default HomePage;