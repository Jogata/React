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
				products.map(product => (
					<h1 key={product._id}>{product.name}</h1>
				))
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

export default HomePage;