import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product name field cannot be blank"]
	},
	price: {
		type: Number,
		required: [true, "Product price numeric value is required"]
	},
	image: {
		type: String,
		required: [true, "Product image layout URL asset must be provided"]
	},
	// userId: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "User",
	// 	required: [true, "A product must be linked to an authenticated creator user account"],
	// 	index: true
	// }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;