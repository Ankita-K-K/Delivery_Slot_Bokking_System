import express from "express";
import cors from "cors";
import slotRoutes from "./routes/slotRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
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

app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
