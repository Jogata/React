import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
// 	{
// 		name: {
// 			type: String,
// 			required: true, 
//             unique: true
// 		},
// 		price: {
// 			type: Number,
// 			required: true
// 		},
// 		image: {
// 			type: String,
// 			required: true
// 		},
// 	},
// 	{
// 		timestamps: true,
// 	}
// );

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
	}
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;