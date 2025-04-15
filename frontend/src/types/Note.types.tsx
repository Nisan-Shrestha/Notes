import { Meta } from "./Meta.types";

export interface Note {
  id: string;
  title: string;
  content: string;
  categories: { noteID: string; categoryId: string; category: Category }[];
  categoryIds?: string[] | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  ownerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ListNotesResponse {
  notes: Note[];
  meta: Meta;
}

export type ListNotesQueryDTO = {
  sortBy: "asc" | "desc";
  sortByField: "createdAt" | "updatedAt";
  categoryIds?: string[] | undefined;
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
};

export type CreateNoteDTO = {
  title: string;
  content?: string | undefined;
  categoryIds?: string[] | undefined;
};

export type UpdateNoteDTO = {
  title: string;
  content?: string | undefined;
  categoryIds?: string[] | undefined;
};
