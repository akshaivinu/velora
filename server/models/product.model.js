import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    sizes: {
      type: [String],
      enum: ["xs", "s", 'm', "l", "xl"],
      default: ['m'],
    },
    category: {
      type: String,
      required: true
    }
  },
  { timestamps: true },
);


const Product = mongoose.model('Product', productSchema)

export default Product