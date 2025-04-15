import {
  CreateNoteDTO,
  ListNotesQueryDTO,
  ListNotesResponse,
  Note,
  UpdateNoteDTO,
} from "@/types/Note.types";
import { toast } from "react-toastify";
import { del, get, post, put } from "../client";

export const noteService = {
  async getNote(noteId: string) {
    const response = await get<Note>(`/notes/${noteId}`, {
      authenticated: true,
    });
    if (response.error) {
      toast.error("Failed to fetch note");
    }
    response.data!.categoryIds = response.data?.categories.map(
      (category) => category.categoryId
    );
    return response;
  },

  async listNotes(filters: ListNotesQueryDTO) {
    const { sortBy, sortByField, categoryIds, search, page, limit } = filters;
    const params = new URLSearchParams();
    if (sortBy) params.append("sortBy", sortBy);
    if (sortByField) params.append("sortByField", sortByField);
    if (categoryIds) {
      params.append("categoryIds", categoryIds.join(","));
    }
    if (search) params.append("search", search);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    const response = await get<ListNotesResponse>(
      `/notes?${params.toString()}`,
      {
        authenticated: true,
      }
    );
    if (response.error) {
      toast.error("Failed to fetch notes");
    }

    response.data!.notes.forEach(
      (n) =>
        (n.categoryIds = n.categories.map((category) => category.categoryId))
    );
    return response;
  },

  async createNote(note: CreateNoteDTO) {
    const response = await post<Note>("/notes", note);
    if (response.error) {
      toast.error("Failed to create note");
    }
    response.data!.categoryIds = response.data?.categories.map(
      (category) => category.categoryId
    );
    return response;
  },
  async updateNote(noteId: string, note: UpdateNoteDTO) {
    const response = await put<Note>(`/notes/${noteId}`, note);
    if (response.error) {
      toast.error("Failed to update note");
    }
    response.data!.categoryIds = response.data?.categories.map(
      (category) => category.categoryId
    );
    return response;
  },

  async deleteNote(noteId: string) {
    const response = await del<Note>(`/notes/${noteId}`);
    if (response.error) {
      toast.error("Failed to delete note");
    }
    response.data!.categoryIds = response.data?.categories.map(
      (category) => category.categoryId
    );
    return response;
  },
};
