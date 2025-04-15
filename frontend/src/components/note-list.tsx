import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category, Note } from "@/types/Note.types";
import { formatDate } from "@/utils/utils";
import { Edit, Eye, Trash2 } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  categories: Category[];
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteList({
  notes,
  categories,
  onView,
  onEdit,
  onDelete,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium">No notes found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new note to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => {
        const noteCategories = categories.filter((cat) =>
          note.categoryIds?.includes(cat.id)
        );

        return (
          <Card key={note.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1">{note.title}</CardTitle>
              <CardDescription className="text-xs">
                {formatDate(note.updatedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm line-clamp-3">{note.content}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 pt-0">
              {noteCategories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {noteCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-2 w-full justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(note)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(note)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this note?")) {
                      onDelete(note.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
