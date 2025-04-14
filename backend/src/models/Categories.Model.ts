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
  { page = 0, limit = 10, search, sortBy }: ListCategoriesQueryDTO
) {
  const skip = page * limit;

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
      createdAt: sortBy ?? "desc",
    },
    skip,
    take: limit,
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
