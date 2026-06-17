import express from "express";
import {
  createSlot,
  getAllSlots,
  getAvailableSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
} from "../controllers/slotController.js";

const router = express.Router();

router.post("/", createSlot);
router.get("/", getAllSlots);
router.get("/available", getAvailableSlots);
router.get("/:slotId", getSlotById);
router.patch("/:slotId", updateSlot);
router.delete("/:slotId", deleteSlot);

export default router;
