import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const HomePage = () => {
	const [ products, setProducts ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		// setLoading(true);

		const controller = new AbortController();
		// try {
			// console.log("get allpro");
			getProducts();
			// setProducts({ products: data });
		// } catch (error) {
			// console.log(error);
		// } finally {
			// console.log("finally");
			// setLoading(false);
		// }

		async function getProducts() {
			console.log("getProducts started");


			setLoading(true);

			try {				
				const res = await fetch("http://localhost:5000/products", {
					signal: controller.signal
				});
				// console.log(res);
				const data = await res.json();
				// console.log(data.data);
				setProducts(data.data);
				// return data;
			} catch (error) {
				console.log("error cathed");
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		return () => {
			controller.abort();
		}
	}, []);
	
	return (
		<>
		{/* loading ? <Loader /> : <Products products={products} /> */}
		{loading ? <Loader /> : <Products products={products} />}
		{/* <Products products={products} /> */}
		</>
	)
		
};

const Products = ({products}) => {
	return (
		<>
		{products.length === 0 ? (
			<>
				<h1>No products found</h1>
				<Link to={"/create"}>
					Create a product
				</Link>
			</>
		) : (
			products.map(product => (
				<h1 key={product._id}>{product.name}</h1>
			))
		)}
		</>
	)
}

export default HomePage;