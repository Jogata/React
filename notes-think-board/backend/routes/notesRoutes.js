import express from "express";
import {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} from "../controllers/notesController.js";
import { validateObjectId } from "../middlewares/validateId.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", validateObjectId, getNoteById);
router.post("/", createNote);
router.put("/:id", validateObjectId, updateNote);
router.delete("/:id", validateObjectId, deleteNote);

export default router;