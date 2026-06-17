import { sendSuccess } from "../utils/apiResponse.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
} from "../services/bookingService.js";

export const bookSlot = async (req, res, next) => {
  try {
    const booking = await createBooking(req.body);

    return sendSuccess(res, 201, "Slot booked successfully", booking);
  } catch (error) {
    next(error);
  }
};

export const fetchBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookings();

    return sendSuccess(res, 200, "Bookings fetched successfully", bookings);
  } catch (error) {
    next(error);
  }
};

export const fetchBookingById = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.bookingId);

    return sendSuccess(res, 200, "Booking fetched successfully", booking);
  } catch (error) {
    next(error);
  }
};

export const cancelSlotBooking = async (req, res, next) => {
  try {
    const booking = await cancelBooking(req.params.bookingId);

    return sendSuccess(res, 200, "Booking cancelled successfully", booking);
  } catch (error) {
    next(error);
  }
};
