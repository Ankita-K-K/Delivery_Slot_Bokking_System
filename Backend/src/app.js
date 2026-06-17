import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Delivery Slot Booking API is running",
  });
});

// Routes will be added here later

app.use(notFound);
app.use(errorHandler);

export default app;
