import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category, Note } from "@/types/Note.types";
import { formatDate } from "@/utils/utils";
import { Edit } from "lucide-react";

interface ViewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  categories: Category[];
  onEdit: () => void;
}

export function ViewNoteDialog({
  open,
  onOpenChange,
  note,
  categories,
  onEdit,
}: ViewNoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
          <DialogDescription>
            Created {formatDate(note.createdAt)}
            {note.createdAt !== note.updatedAt &&
              ` • Updated ${formatDate(note.updatedAt)}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="whitespace-pre-wrap">{note.content}</div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {categories.map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
