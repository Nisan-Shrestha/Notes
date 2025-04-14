import * as CategoryService from "../services/Categories.Services";
import { Response, NextFunction } from "express";
import { Request, returnResponse } from "../utils/requestHandler";
import { BaseError } from "../utils/BaseError";
import { StatusCodes } from "http-status-codes";

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = res.locals.validated.body;

  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const ownerId = req.user.id as string;

  const serviceResponse = await CategoryService.createCategoryService({
    name: data.name.toLowerCase(),
    ownerId: ownerId,
  });

  if (!serviceResponse) {
    throw new BaseError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Category creation failed"
    );
  }

  returnResponse(
    res,
    serviceResponse,
    "Category created successfully",
    StatusCodes.CREATED
  );
  return;
}

export async function getCategoryById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const params = res.locals.validated.params;
  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const userId = req.user.id as string;

  const serviceResponse = await CategoryService.getCategoryById(
    params.id,
    userId
  );

  if (!serviceResponse) {
    throw new BaseError(StatusCodes.NOT_FOUND, "Category not found");
  }

  returnResponse(
    res,
    serviceResponse,
    "Category retrieved successfully",
    StatusCodes.OK
  );
}

export async function listCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }
  const params = res.locals.validated.query;
  const userId = req.user.id as string;

  const serviceResponse = await CategoryService.listCategories(userId, params);

  returnResponse(
    res,
    serviceResponse,
    "Categories retrieved successfully",
    StatusCodes.OK
  );
}

export async function updateCategory(
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

  const serviceResponse = await CategoryService.updateCategory(
    params.id,
    userId,
    data
  );

  if (!serviceResponse) {
    throw new BaseError(StatusCodes.NOT_FOUND, "Category not found");
  }

  returnResponse(
    res,
    serviceResponse,
    "Category updated successfully",
    StatusCodes.OK
  );
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const params = res.locals.validated.params;

  if (!req.user) {
    throw new BaseError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const userId = req.user.id as string;

  const serviceResponse = await CategoryService.deleteCategory(
    params.id,
    userId
  );

  if (!serviceResponse) {
    throw new BaseError(StatusCodes.NOT_FOUND, "Category not found");
  }

  returnResponse(
    res,
    serviceResponse,
    "Category deleted successfully",
    StatusCodes.OK
  );
}
