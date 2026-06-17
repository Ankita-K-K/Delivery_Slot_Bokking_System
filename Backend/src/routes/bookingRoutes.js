import express from "express";
import {
  bookSlot,
  fetchBookings,
  fetchBookingById,
  cancelSlotBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", bookSlot);
router.get("/", fetchBookings);
router.get("/:bookingId", fetchBookingById);
router.patch("/:bookingId/cancel", cancelSlotBooking);

export default router;
