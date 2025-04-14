import {
  CreateNoteDTO,
  ListNotesQueryDTO,
  UpdateNoteDTO,
} from "./../schemas/Notes.Schema";
import * as NotesModel from "../models/Notes.Model";
import prisma from "../config/prismaClient";
import { BaseError } from "../utils/BaseError";
import { StatusCodes } from "http-status-codes";
import { Note } from "@prisma/client";

export async function createNoteService(input: CreateNoteDTO): Promise<Note> {
  const { authorId, categoryIds } = input;

  if (categoryIds && categoryIds.length > 0) {
    const validCount = await prisma.category.count({
      where: {
        id: { in: categoryIds },
        ownerId: authorId,
      },
    });

    if (validCount !== categoryIds.length) {
      throw new BaseError(
        StatusCodes.NOT_FOUND,
        "One or more categories not found for user."
      );
    }
  }

  return NotesModel.createNote(input);
}

export async function getNoteById(noteId: string, userId: string) {
  return NotesModel.getNoteById(noteId, userId);
}

export async function listNotes(userId: string, query: ListNotesQueryDTO) {
  return NotesModel.listNotes(userId, query);
}

export async function updateNote(
  noteId: string,
  userId: string,
  data: Partial<UpdateNoteDTO>
): Promise<Note> {
  const { categoryIds } = data;

  if (categoryIds && categoryIds.length > 0) {
    const validCount = await prisma.category.count({
      where: {
        id: { in: categoryIds },
        ownerId: userId,
      },
    });

    if (validCount !== categoryIds.length) {
      throw new BaseError(
        StatusCodes.NOT_FOUND,
        "One or more categories not found for user."
      );
    }
  }

  return NotesModel.updateNote(noteId, userId, data);
}

export async function deleteNote(
  noteId: string,
  userId: string
): Promise<Note> {
  const note = await NotesModel.getNoteById(noteId, userId);
  if (!note) {
    throw new BaseError(StatusCodes.NOT_FOUND, "Note not found");
  }
  if (note.authorId !== userId) {
    throw new BaseError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to delete this note"
    );
  }
  return NotesModel.deleteNote(noteId, userId);
}
