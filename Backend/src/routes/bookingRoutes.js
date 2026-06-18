import express from "express";
import {
  bookSlot,
  fetchBookings,
  fetchBookingById,
  cancelSlotBooking,
  recommendSlot,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", bookSlot);
router.get("/", fetchBookings);
router.post("/recommend", recommendSlot);
router.get("/:bookingId", fetchBookingById);
router.patch("/:bookingId/cancel", cancelSlotBooking);

export default router;
