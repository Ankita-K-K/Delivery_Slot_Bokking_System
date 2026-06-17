import mongoose from "mongoose";
import Slot from "../models/Slot.js";
import Booking from "../models/Booking.js";

export const findNextAvailableSlot = async (selectedSlot) => {
  return await Slot.findOne({
    isActive: true,
    $expr: { $lt: ["$bookedCount", "$capacity"] },
    $or: [
      { date: { $gt: selectedSlot.date } },
      {
        date: selectedSlot.date,
        startTime: { $gt: selectedSlot.startTime },
      },
    ],
  }).sort({ date: 1, startTime: 1 });
};

export const createBooking = async (bookingData) => {
  const { customerName, phone, address, slotId } = bookingData;

  if (!customerName || !phone || !address || !slotId) {
    const error = new Error(
      "customerName, phone, address and slotId are required",
    );
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    const error = new Error("Invalid slot ID");
    error.statusCode = 400;
    throw error;
  }

  const selectedSlot = await Slot.findById(slotId);

  if (!selectedSlot) {
    const error = new Error("Slot not found");
    error.statusCode = 404;
    throw error;
  }

  if (!selectedSlot.isActive) {
    const error = new Error("Selected slot is not active");
    error.statusCode = 400;
    throw error;
  }

  const updatedSlot = await Slot.findOneAndUpdate(
    {
      _id: slotId,
      isActive: true,
      $expr: { $lt: ["$bookedCount", "$capacity"] },
    },
    {
      $inc: { bookedCount: 1 },
    },
    {
      new: true,
    },
  );

  if (!updatedSlot) {
    const suggestedSlot = await findNextAvailableSlot(selectedSlot);

    const error = new Error("Selected slot is full");
    error.statusCode = 409;
    error.suggestedSlot = suggestedSlot;

    throw error;
  }

  const booking = await Booking.create({
    customerName,
    phone,
    address,
    slotId,
    status: "CONFIRMED",
  });

  return await Booking.findById(booking._id).populate("slotId");
};

export const getAllBookings = async () => {
  return await Booking.find().populate("slotId").sort({ createdAt: -1 });
};

export const getBookingById = async (bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error("Invalid booking ID");
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId).populate("slotId");

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  return booking;
};

export const cancelBooking = async (bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error("Invalid booking ID");
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status === "CANCELLED") {
    const error = new Error("Booking is already cancelled");
    error.statusCode = 400;
    throw error;
  }

  booking.status = "CANCELLED";
  await booking.save();

  await Slot.findByIdAndUpdate(booking.slotId, {
    $inc: { bookedCount: -1 },
  });

  return await Booking.findById(booking._id).populate("slotId");
};
