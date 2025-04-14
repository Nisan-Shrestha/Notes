import {
  CreateCategoryDTO,
  ListCategoriesQueryDTO,
  UpdateCategoryDTO,
} from "../schemas/Categories.Schema";
import * as CategoriesModel from "../models/Categories.Model";
import prisma from "../config/prismaClient";
import { BaseError } from "../utils/BaseError";
import { StatusCodes } from "http-status-codes";
import { Category } from "@prisma/client";

export async function createCategoryService(
  input: CreateCategoryDTO
): Promise<Category & { duplicate?: boolean }> {
  const { ownerId, name } = input;
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: { equals: name.toLowerCase(), mode: "insensitive" },
      ownerId: ownerId,
    },
  });

  if (existingCategory) {
    return { ...existingCategory, duplicate: true };
  }

  return CategoriesModel.createCategory(input);
}

export async function getCategoryById(categoryId: string, userId: string) {
  return CategoriesModel.getCategoryById(categoryId, userId);
}

export async function listCategories(
  userId: string,
  query: ListCategoriesQueryDTO
) {
  return CategoriesModel.listCategories(userId, query);
}

export async function updateCategory(
  categoryId: string,
  userId: string,
  data: UpdateCategoryDTO
): Promise<Category> {
  const { name } = data;

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: { equals: name.toLowerCase(), mode: "insensitive" },
      ownerId: userId,
    },
  });

  if (existingCategory) {
    throw new BaseError(
      StatusCodes.CONFLICT,
      "Category with this name already exists for this user"
    );
  }
  return CategoriesModel.updateCategory(categoryId, userId, data);
}

export async function deleteCategory(
  categoryId: string,
  userId: string
): Promise<Category> {
  const category = await CategoriesModel.getCategoryById(categoryId, userId);
  if (!category) {
    throw new BaseError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const catInUse = await isCategoryInUse(categoryId);
  if (catInUse) {
    throw new BaseError(
      StatusCodes.BAD_REQUEST,
      "Category cannot be deleted as it is in use"
    );
  }
  if (category.ownerId !== userId) {
    throw new BaseError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to delete this category"
    );
  }
  return CategoriesModel.deleteCategory(categoryId, userId);
}

export const isCategoryInUse = async (categoryId: string): Promise<boolean> => {
  const count = await prisma.note.count({
    where: {
      categories: {
        some: {
          categoryId: categoryId,
        },
      },
    },
  });
  return count > 0;
};
