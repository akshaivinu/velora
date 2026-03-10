import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { connectDB } from "./config/db.config.js";

import productRoutes from "./routes/product.routes.js";

const app = express();

config({
  quiet: true,
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());

app.use("/api/products", productRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(
      `Server running on http://localhost:${process.env.PORT || 8000}`,
    );
  });
});
