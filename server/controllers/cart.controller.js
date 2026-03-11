import Cart from "../models/cart.model.js";

const normalizeProduct = (entry) => ({
  productId: entry.productId?.toString?.() ?? entry.productId,
  quantity: Math.max(1, Number(entry.quantity) || 1),
});

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId",
    );

    if (!cart) {
      return res.status(200).json({ products: [] });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve cart",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const normalized = normalizeProduct({ productId, quantity });

    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      const existingIndex = cart.products.findIndex(
        (product) => product.productId.toString() === normalized.productId,
      );

      if (existingIndex >= 0) {
        cart.products[existingIndex].quantity += normalized.quantity;
      } else {
        cart.products.push(normalized);
      }

      await cart.save();
      return res.status(200).json({ cart });
    }

    const createdCart = await Cart.create({
      userId: req.user._id,
      products: [normalized],
    });

    return res.status(201).json({ cart: createdCart });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to add item to cart",
      error: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ message: "products should be an array of { productId, quantity }" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = products
      .filter((entry) => entry.productId && Number(entry.quantity) > 0)
      .map(normalizeProduct);

    await cart.save();

    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update cart",
      error: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "productId parameter is required" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId,
    );

    await cart.save();

    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to remove item from cart",
      error: error.message,
    });
  }
};
