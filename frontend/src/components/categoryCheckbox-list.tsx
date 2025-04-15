import { Category } from "@/types/Note.types";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface CategorySelectorProps {
  idPrefix: string;
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, checked: boolean) => void;
}
export function CategorySelector({
  idPrefix,
  categories,
  selectedCategories,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <>
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-category-${category.id}`}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={(checked) =>
              onCategoryChange(category.id, checked === true)
            }
          />
          <Label
            htmlFor={`${idPrefix}-category-${category.id}`}
            className="text-sm font-normal cursor-pointer"
          >
            {category.name}
          </Label>
        </div>
      ))}
    </>
  );
}
