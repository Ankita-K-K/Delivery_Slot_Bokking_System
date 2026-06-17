import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },

    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

slotSchema.index({ date: 1, startTime: 1, endTime: 1 }, { unique: true });

slotSchema.virtual("availableCount").get(function () {
  return this.capacity - this.bookedCount;
});

slotSchema.virtual("isAvailable").get(function () {
  return this.isActive && this.bookedCount < this.capacity;
});

slotSchema.set("toJSON", { virtuals: true });
slotSchema.set("toObject", { virtuals: true });

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;
