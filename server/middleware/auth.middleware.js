import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const authCheck = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({
        message: "unAuthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const id = decoded.id;

    const user = await User.findById(id).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
