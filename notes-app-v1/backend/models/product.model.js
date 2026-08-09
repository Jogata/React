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

// ==================================================================================
// const projectSchema = new mongoose.Schema({
// 	// _id is natively immutable, but you can explicitly declare it
// 	_id: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		immutable: true
// 	},
// 	name: {
// 		type: String,
// 		required: true
// 	}
// }, {
// 	timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
// });

// // Explicit safeguard: Force createdAt to be immutable just in case
// projectSchema.path('createdAt').immutable(true);
// ==================================================================================


// const userSchema = new mongoose.Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 		// Only prevents updates if the user is NOT an admin
// 		immutable: (doc) => doc.role !== 'ADMIN'
// 	},
// 	role: {
// 		type: String,
// 		default: 'USER'
// 	}
// });