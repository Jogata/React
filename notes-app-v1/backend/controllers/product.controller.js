// import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		// const sortedProducts = await Product.find({}).sort({createdAt: -1});
		res.status(200).json({ success: true, data: products });
		// res.status(200).send("text message");
	} catch (error) {
		console.log("error in fetching products:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createProduct = async (req, res) => {
	const product = req.body;

	try {
		const newProduct = await Product.create(product);
		const productUrl = `/api/products/${newProduct._id}`;
	
		res.status(201).location(productUrl).json({ success: true, data: newProduct });
	} catch (error) {
		// todo: ValidationError
		let message = error.message;
		
		if (error.code == 11000) {
			message = `A product with the name '${product.name}' already exists. Please choose a different name.`;
			console.log(11000, message);
			return res.status(409).json({ success: false, message });
		}

		console.error("Error in Create product:", message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;

	const product = req.body;

	// if (!mongoose.Types.ObjectId.isValid(id)) {
	// 	return res.status(404).json({ success: false, message: "Invalid Product Id" });
	// }

	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
		res.status(200).json({ success: true, data: updatedProduct });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;
	console.log(id);

	// if (!mongoose.Types.ObjectId.isValid(id)) {
	// 	return res.status(404).json({ success: false, message: "Invalid Product Id" });
	// }

	try {
		const deletedProduct = await Product.findByIdAndDelete(id);

		if (!deletedProduct) {
			return res.status(404).json({ 
				success: false, message: "Product record not found inside the database." 
			});
		}
			
		res.status(200).json({ success: true, message: "Product deleted" });
	} catch (error) {
		// let message = error.message;
		// if (error.code == 11000) {
		// 	message = `A product with the ID '${id}' doesn't exists.`;
		// 	console.log(11000, message);
		// 	return res.status(409).json({ success: false, message });
		// }

		console.log("error in deleting product:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};