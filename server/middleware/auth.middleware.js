import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const authCheck = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(404).json({
        message: "unAuthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const id = decoded.id;

    const user = await User.findById(id);

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
