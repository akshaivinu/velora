import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true },
);


const Cart = mongoose.model('Cart', cartSchema)

export default Cart