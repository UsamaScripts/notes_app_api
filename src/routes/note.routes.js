import express from "express";
const router = express.Router();

import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
} from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateNote } from "../middleware/validator.js";

router.get("/", protect, getNotes);
router.get("/search", protect, searchNotes);
router.post("/", protect, validateNote, createNote);
router.get("/:id", protect, getNoteById);

router.put("/:id", protect, validateNote, updateNote);

router.delete("/:id", protect, deleteNote);

export default router;
