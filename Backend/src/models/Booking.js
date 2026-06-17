import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Slot ID is required"],
    },

    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
