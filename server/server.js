import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { connectDB } from "./config/db.config.js";
import { generalRateLimiter } from "./middleware/rateLimiter.js";

import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

config({
  quiet: true,
});

app.use(express.json());
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true,
  },
));
app.use(cookieParser());
app.use(helmet());
app.use(generalRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(
      `Server running on http://localhost:${process.env.PORT || 8000}`,
    );
  });
});
