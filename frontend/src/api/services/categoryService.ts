import { Category } from "@/types/Note.types";
import { toast } from "react-toastify";
import { del, get, post, put } from "../client";

export const categoryService = {
  async listCategories() {
    const response = await get<Category[]>(`/categories`, {
      authenticated: true,
    });
    if (response.error) {
      toast.error("Failed to fetch categories");
    }
    return response;
  },

  async createCategory(category: { name: string }) {
    const response = await post<Category>("/categories", category);
    if (response.error) {
      toast.error("Failed to create category");
    }
    toast.success("Category created successfully");
    return response;
  },
  async updateCategory(categoryId: string, category: { name: string }) {
    const response = await put<Category>(`/categorys/${categoryId}`, category);
    if (response.error) {
      toast.error("Failed to update category");
    }
    return response;
  },

  async deleteCategory(categoryId: string) {
    const response = await del<Category>(`/categorys/${categoryId}`);
    if (response.error) {
      toast.error("Failed to delete category");
    }
    return response;
  },
};
