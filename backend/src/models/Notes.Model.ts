import prisma from "../config/prismaClient";
import {
  CreateNoteDTO,
  ListNotesQueryDTO,
  UpdateNoteDTO,
} from "../schemas/Notes.Schema";

export async function createNote(data: CreateNoteDTO) {
  const { title, content, authorId, categoryIds } = data;

  return prisma.note.create({
    data: {
      title,
      content,
      authorId,
      categories: categoryIds
        ? {
            create: categoryIds.map((categoryId: string) => ({
              category: { connect: { id: categoryId } },
            })),
          }
        : undefined,
    },
    include: {
      categories: { include: { category: true } },
    },
  });
}

export async function getNoteById(noteId: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      authorId: userId,
    },
    include: {
      categories: { include: { category: true } },
    },
  });
  return note;
}

export async function listNotes(
  userID: string,
  {
    page = 0,
    limit = 10,
    categoryIds,
    search,
    sortBy,
    sortByField,
  }: ListNotesQueryDTO
) {
  const skip = page * limit;

  const andConditions: any[] = [{ authorId: userID }];

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (categoryIds && categoryIds.length > 0) {
    andConditions.push({
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    });
  }

  const totalCount = await prisma.note.count({
    where: { AND: andConditions },
  });

  const notes = await prisma.note.findMany({
    where: { AND: andConditions },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      [sortByField ?? "createdAt"]: sortBy ?? "desc",
    },
    skip,
    take: limit,
  });

  const totalPages = Math.ceil(totalCount / limit);

  return { notes, meta: { totalCount, totalPages, page, limit } };
}

export async function updateNote(
  noteId: string,
  userId: string,
  data: Partial<UpdateNoteDTO>
) {
  const { title, content, categoryIds } = data;

  return prisma.note.update({
    where: {
      id: noteId,
      authorId: userId,
    },
    data: {
      title,
      content,
      categories: categoryIds
        ? {
            deleteMany: {},
            create: categoryIds.map((categoryId: string) => ({
              category: { connect: { id: categoryId } },
            })),
          }
        : undefined,
    },
    include: {
      categories: { include: { category: true } },
    },
  });
}

export async function deleteNote(noteID: string, userId: string) {
  return prisma.note.delete({
    where: {
      id: noteID,
      authorId: userId,
    },
  });
}
