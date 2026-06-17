import Slot from "../models/Slot.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const createSlot = async (req, res, next) => {
  try {
    const { date, startTime, endTime, capacity } = req.body;

    if (!date || !startTime || !endTime || !capacity) {
      res.status(400);
      throw new Error("date, startTime, endTime and capacity are required");
    }

    if (capacity < 1) {
      res.status(400);
      throw new Error("Capacity must be at least 1");
    }

    if (startTime >= endTime) {
      res.status(400);
      throw new Error("Start time must be before end time");
    }

    const slot = await Slot.create({
      date,
      startTime,
      endTime,
      capacity,
    });

    return sendSuccess(res, 201, "Slot created successfully", slot);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      error.message = "Slot already exists for this date and time";
    }
    next(error);
  }
};

export const getAllSlots = async (req, res, next) => {
  try {
    const slots = await Slot.find().sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 200, "Slots fetched successfully", slots);
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req, res, next) => {
  try {
    const slots = await Slot.find({
      isActive: true,
      $expr: { $lt: ["$bookedCount", "$capacity"] },
    }).sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 200, "Available slots fetched successfully", slots);
  } catch (error) {
    next(error);
  }
};

export const getSlotById = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.slotId);

    if (!slot) {
      res.status(404);
      throw new Error("Slot not found");
    }

    return sendSuccess(res, 200, "Slot fetched successfully", slot);
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (req, res, next) => {
  try {
    const { capacity, isActive } = req.body;

    const slot = await Slot.findById(req.params.slotId);

    if (!slot) {
      res.status(404);
      throw new Error("Slot not found");
    }

    if (capacity !== undefined) {
      if (capacity < slot.bookedCount) {
        res.status(400);
        throw new Error("Capacity cannot be less than already booked count");
      }

      if (capacity < 1) {
        res.status(400);
        throw new Error("Capacity must be at least 1");
      }

      slot.capacity = capacity;
    }

    if (isActive !== undefined) {
      slot.isActive = isActive;
    }

    const updatedSlot = await slot.save();

    return sendSuccess(res, 200, "Slot updated successfully", updatedSlot);
  } catch (error) {
    next(error);
  }
};

export const deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.slotId);

    if (!slot) {
      res.status(404);
      throw new Error("Slot not found");
    }

    slot.isActive = false;
    await slot.save();

    return sendSuccess(res, 200, "Slot disabled successfully", slot);
  } catch (error) {
    next(error);
  }
};
