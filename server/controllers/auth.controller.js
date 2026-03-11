import User from "../models/user.model.js";
import { hashPassword } from "../utils/hashPassword.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const setAccessHeader = (res, token) => {
  res.setHeader("Authorization", `Bearer ${token}`);
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const exisitingUser = await User.findOne({ email });

    if (exisitingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing fields required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatching = await bcrypt.compare(password, user.password);

    if (!passwordMatching) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    setAccessHeader(res, accessToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
      path: '/auth/refresh'
    });

    return res.status(200).json({
      message: "Login successfull",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
    } catch (verifyError) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    const id = decoded.id;

    const user = await User.findById(id);

    if (!user || user.refreshToken !== token) {
      if (user) {
        user.refreshToken = null;
        await user.save();
      }

      res.clearCookie("refreshToken");

      return res.status(401).json({
        message: "Refresh token reused or invalidated; please log in again",
      });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    setAccessHeader(res, newAccessToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.status(200).json({
      message: "Token refreshed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      } catch (verifyError) {
        // ignore invalid token during logout
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
