import * as NoteService from "../services/Notes.Services";
import { Response, NextFunction } from "express";
import { Request, returnResponse } from "../utils/requestHandler";
import { BaseError } from "../utils/BaseError";
import { StatusCodes } from "http-status-codes";

export async function createNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = res.locals.validated.body;

  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const authorId = req.user.id as string;

  const serviceResponse = await NoteService.createNoteService({
    title: data.title,
    content: data.content,
    categoryIds: data.categoryIds,
    authorId,
  });

  if (!serviceResponse) {
    throw new BaseError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Note creation failed"
    );
  }

  returnResponse(
    res,
    serviceResponse,
    "Note created successfully",
    StatusCodes.CREATED
  );
  return;
}

export async function getNoteById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const params = res.locals.validated.params;
  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const userId = req.user.id as string;

  const serviceResponse = await NoteService.getNoteById(params.id, userId);

  if (!serviceResponse) {
    throw new BaseError(StatusCodes.NOT_FOUND, "Note not found");
  }

  returnResponse(
    res,
    serviceResponse,
    "Note retrieved successfully",
    StatusCodes.OK
  );
}

export async function listNotes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }
  const params = res.locals.validated.query;
  const userId = req.user.id as string;
  const serviceResponse = await NoteService.listNotes(userId, params);

  returnResponse(
    res,
    serviceResponse,
    "Notes retrieved successfully",
    StatusCodes.OK
  );
}

export async function updateNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const params = res.locals.validated.params;
  const data = res.locals.validated.body;

  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const userId = req.user.id as string;

  const serviceResponse = await NoteService.updateNote(params.id, userId, data);

  if (!serviceResponse) {
    throw new BaseError(StatusCodes.NOT_FOUND, "Note not found");
  }

  returnResponse(
    res,
    serviceResponse,
    "Note updated successfully",
    StatusCodes.OK
  );
}

export async function deleteNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const params = res.locals.validated.params;

  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const userId = req.user.id as string;

  const serviceResponse = await NoteService.deleteNote(params.id, userId);

  if (!serviceResponse) {
    throw new BaseError(StatusCodes.NOT_FOUND, "Note not found");
  }

  returnResponse(
    res,
    serviceResponse,
    "Note deleted successfully",
    StatusCodes.OK
  );
}
