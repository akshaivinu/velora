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
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["xs", "s", "l", "xl"],
      default: "xs",
    },
  },
  { timestamps: true },
);


const Product = mongoose.model('Product', productSchema)

export default Product