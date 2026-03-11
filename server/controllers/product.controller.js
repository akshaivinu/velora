import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, page = "1", limit = "10" } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined) {
      const parsedPrice = Number.parseFloat(minPrice);
      if (Number.isFinite(parsedPrice) && parsedPrice >= 0) {
        filter.price = { $gte: parsedPrice };
      }
    }

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);

    const products = await Product.find(filter)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock, sizes, category } =
      req.body;

    if (
      !name ||
      !description ||
      !price ||
      !image ||
      !stock ||
      !sizes ||
      !category
    ) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const newProduct = {
      name,
      description,
      price,
      image,
      stock,
      sizes,
      category,
    };

    const product = await Product.create(newProduct);

    return res.status(201).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, image, stock, sizes, category } =
      req.body;

    const updateProduct = {
      name,
      description,
      price,
      image,
      stock,
      sizes,
      category,
    };

    const product = await Product.findByIdAndUpdate(id, updateProduct, {
      returnDocument: "after",
      runValidators: true,
    });

    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  return getAllProducts(req, res);
};

export const getProductsByMinPrice = async (req, res) => {
  return getAllProducts(req, res);
};

export const getProductsByPageLimit = async (req, res) => {
  return getAllProducts(req, res);
};
