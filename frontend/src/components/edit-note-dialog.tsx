import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category, Note, UpdateNoteDTO } from "@/types/Note.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CategorySelector } from "./categoryCheckbox-list";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  categories: Category[];
  onSubmit: (noteToUpdate: UpdateNoteDTO, noteId: string) => void;
}

const editNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  categoryIds: z.array(z.string()).optional(),
});

export function EditNoteDialog({
  open,
  onOpenChange,
  note,
  categories,
  onSubmit,
}: EditNoteDialogProps) {
  const form = useForm<z.infer<typeof editNoteSchema>>({
    resolver: zodResolver(editNoteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
      categoryIds: note.categoryIds ?? [],
    },
  });

  const handleSubmit = (values: z.infer<typeof editNoteSchema>) => {
    if (!values.content) values.content = "";
    onSubmit(values, note.id);
    onOpenChange(false); // Close the dialog after submission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>Make changes to your note</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter note title"
                        {...field}
                        className={
                          form.formState.errors.title ? "border-red-500" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter note content"
                        rows={5}
                        {...field}
                        className={
                          form.formState.errors.content ? "border-red-500" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <CategorySelector
                        idPrefix="edit"
                        categories={categories}
                        selectedCategories={field.value || []}
                        onCategoryChange={(categoryId, checked) => {
                          const updatedCategories = checked
                            ? [...(field.value || []), categoryId]
                            : (field.value || []).filter(
                                (id) => id !== categoryId
                              );
                          field.onChange(updatedCategories);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
