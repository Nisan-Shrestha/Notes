import express from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
} from "../controllers/Notes.Controller";
import { authenticate } from "../middlewares/Auth.Middleware";
import { validateReqSchema } from "../middlewares/validator";
import {
  createNoteSchema,
  listNotesQuerySchema,
  noteIdParamSchema,
  updateNoteSchema,
} from "../schemas/Notes.Schema";
import { handleRequest } from "../utils/requestHandler";

const router = express();

router.get(
  "/:id",
  authenticate,
  validateReqSchema(noteIdParamSchema),
  handleRequest(getNoteById)
);
router.get(
  "/",
  authenticate,
  validateReqSchema(listNotesQuerySchema),
  handleRequest(listNotes)
);
router.post(
  "/",
  authenticate,
  validateReqSchema(createNoteSchema),
  handleRequest(createNote)
);
router.put(
  "/:id",
  authenticate,
  validateReqSchema(updateNoteSchema),
  handleRequest(updateNote)
);
router.delete(
  "/:id",
  authenticate,
  validateReqSchema(noteIdParamSchema),
  handleRequest(deleteNote)
);

export default router;
