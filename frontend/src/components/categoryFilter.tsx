import { AddCategoryDialog } from "@/components/addCategoryDialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/Note.types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategorySelector } from "./categoryCheckbox-list";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onChange: (selectedIds: string[]) => void;
  onAddCategory: (categoryName: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onChange,
  onAddCategory,
}: CategoryFilterProps) {
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedCategories, categoryId]);
    } else {
      onChange(selectedCategories.filter((id) => id !== categoryId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-1">
        <h3 className="text-sm font-medium">Filter by category</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddCategoryDialogOpen(true)}
        >
          <Plus className="h-4 w-4 " />
          Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories found</p>
        ) : (
          <CategorySelector
            idPrefix=""
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </div>

      <AddCategoryDialog
        open={isAddCategoryDialogOpen}
        onOpenChange={setIsAddCategoryDialogOpen}
        onSubmit={onAddCategory}
      />
    </div>
  );
}
