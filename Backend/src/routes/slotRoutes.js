import express from "express";
import {
  createSlot,
  getAllSlots,
  getAvailableSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
  generateBulkSlots,
} from "../controllers/slotController.js";

const router = express.Router();

router.post("/", createSlot);
router.get("/", getAllSlots);
router.get("/available", getAvailableSlots);
router.post("/bulk-generate", generateBulkSlots);
router.get("/:slotId", getSlotById);
router.patch("/:slotId", updateSlot);
router.delete("/:slotId", deleteSlot);

export default router;
