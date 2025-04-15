import prisma from "../config/prismaClient";
import {
  CreateCategoryDTO,
  ListCategoriesQueryDTO,
  UpdateCategoryDTO,
} from "../schemas/Categories.Schema";

export async function createCategory(data: CreateCategoryDTO) {
  const { name, ownerId } = data;

  return prisma.category.create({
    data: {
      name,
      ownerId,
    },
  });
}

export async function getCategoryById(categoryId: string, userId: string) {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      ownerId: userId,
    },
  });
  return category;
}

export async function listCategories(
  userID: string,
  { page = 0, limit = 0, search, sortBy }: ListCategoriesQueryDTO
) {
  const skip = limit > 0 ? page * limit : undefined;

  const categories = await prisma.category.findMany({
    where: {
      ownerId: userID,
      ...(search
        ? {
            name: { contains: search, mode: "insensitive" },
          }
        : {}),
    },
    orderBy: {
      name: sortBy ?? "asc",
    },
    skip,
    take: limit > 0 ? limit : undefined,
  });

  return categories;
}

export async function updateCategory(
  categoryId: string,
  userId: string,
  data: Partial<UpdateCategoryDTO>
) {
  const { name } = data;

  return prisma.category.update({
    where: {
      id: categoryId,
      ownerId: userId,
    },
    data: {
      name: name?.toLowerCase(),
    },
  });
}

export async function deleteCategory(categoryID: string, userId: string) {
  return prisma.category.delete({
    where: {
      id: categoryID,
      ownerId: userId,
    },
  });
}
