import Slot from "../models/Slot.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const createSlot = async (req, res, next) => {
  try {
    const { date, startTime, endTime, capacity } = req.body;

    if (!date || !startTime || !endTime || !capacity) {
      res.status(400);
      throw new Error("date, startTime, endTime and capacity are required");
    }

    const slotCapacity = Number(capacity);

    if (slotCapacity < 1) {
      res.status(400);
      throw new Error("Capacity must be at least 1");
    }

    if (slotCapacity > 100) {
      res.status(400);
      throw new Error("Capacity cannot exceed 100");
    }

    if (startTime >= endTime) {
      res.status(400);
      throw new Error("End time must be greater than start time");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    if (slotDate < today) {
      res.status(400);
      throw new Error("Cannot create slot for a past date");
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const duration = endTotalMinutes - startTotalMinutes;

    if (duration < 30) {
      res.status(400);
      throw new Error("Slot duration must be at least 30 minutes");
    }

    const now = new Date();

    if (slotDate.getTime() === today.getTime()) {
      const slotStartDateTime = new Date();
      slotStartDateTime.setHours(startHour, startMinute, 0, 0);

      if (slotStartDateTime <= now) {
        res.status(400);
        throw new Error("Cannot create slot for a past time");
      }
    }

    const overlappingSlot = await Slot.findOne({
      date,
      isActive: true,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlappingSlot) {
      res.status(409);
      throw new Error("Slot overlaps with an existing active slot");
    }

    const existingSlot = await Slot.findOne({
      date,
      startTime,
      endTime,
    });

    if (existingSlot) {
      if (!existingSlot.isActive) {
        existingSlot.isActive = true;
        existingSlot.capacity = slotCapacity;

        const reactivatedSlot = await existingSlot.save();

        return sendSuccess(
          res,
          200,
          "Slot reactivated successfully",
          reactivatedSlot,
        );
      }

      res.status(409);
      throw new Error("Slot already exists for this date and time");
    }

    const slot = await Slot.create({
      date,
      startTime,
      endTime,
      capacity: slotCapacity,
    });

    return sendSuccess(res, 201, "Slot created successfully", slot);
  } catch (error) {
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
