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
// 	timestamps: true // Automatically creates "createdAt" and "updatedAt"
// });

// // Explicit safeguard: Force createdAt to be immutable just in case
// projectSchema.path("createdAt").immutable(true);
// ==================================================================================

// ==================================================================================
// const productSchema = new mongoose.Schema({
// 	name: {
// 		type: String,
// 		required: [true, "Product name is required"],
// 		minlength: [3, "Name must be at least 3 characters long"]
// 	},
// 	price: {
// 		type: Number,
// 		required: [true, "Price is required"],
// 		min: [0, "Price cannot be negative"]
// 	},
// 	stock: {
// 		type: Number,
// 		required: [true, "Stock count is required"],
// 		validate: {
// 			validator: Number.isInteger,
// 			message: "Stock must be a whole number"
// 		}
// 	},
// 	sku: {
// 		type: String,
// 		required: [true, "SKU is required"],
// 		validate: [
// 			{
// 				validator: function (val) {
// 					return val.startsWith("PROD-");
// 				},
// 				message: "SKU must start with the prefix "PROD-""
// 			},
// 			{
// 				validator: function (val) {
// 					return /^[A-Z0-9-]+$/.test(val);
// 				},
// 				message: "SKU can only contain uppercase letters, numbers, and dashes"
// 			},
// 			{
// 				validator: function (val) {
// 					return !val.includes("TEST");
// 				},
// 				message: "SKU cannot contain the placeholder word "TEST""
// 			}
// 		]
// 	}
// });
// ==================================================================================


// const userSchema = new mongoose.Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 		// Only prevents updates if the user is NOT an admin
// 		immutable: (doc) => doc.role !== "ADMIN"
// 	},
// 	role: {
// 		type: String,
// 		default: "USER"
// 	}
// });