import { categoryService } from "@/api/services/categoryService";
import { noteService } from "@/api/services/noteService";
import { CategoryFilter } from "@/components/categoryFilter";
import { CreateNoteDialog } from "@/components/createNoteDailog";
import { EditNoteDialog } from "@/components/edit-note-dialog";
import { NoteList } from "@/components/note-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewNoteDialog } from "@/components/view-note-dialog";
import {
  Category,
  CreateNoteDTO,
  Note,
  UpdateNoteDTO,
} from "@/types/Note.types";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("updatedAt.desc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [notesLimit, setNotesLimit] = useState("4");
  const [totalNotes, setTotalNotes] = useState(0);
  useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  useEffect(() => {
    async function listNotes() {
      const [sortByField, sortBy] = sortOption.split(".") as [
        "createdAt" | "updatedAt",
        "asc" | "desc"
      ];
      const response = await noteService.listNotes({
        sortBy,
        sortByField,
        page: currentPage,
        limit: parseInt(notesLimit),
        categoryIds: selectedCategories,
        search: debouncedSearchQuery,
      });
      setNotes(response.data!.notes);
      setCurrentPage(response.data!.meta.page);
      setMaxPage(response.data!.meta.totalPages);
      setNotesLimit(response.data!.meta.limit.toString());
      setTotalNotes(response.data!.meta.totalCount);

      const categoriesResponse = await categoryService.listCategories();
      setCategories(categoriesResponse.data!);
    }
    listNotes();
  }, [
    currentPage,
    notesLimit,
    selectedCategories,
    debouncedSearchQuery,
    sortOption,
  ]);

  const handleCreateNote = async (
    note: Omit<Note, "id" | "createdAt" | "updatedAt" | "categories">
  ) => {
    const newNote: CreateNoteDTO = {
      title: note.title,
      content: note.content,
      categoryIds: note.categoryIds,
    };
    const serviceResponse = await noteService.createNote(newNote);
    const createdNote: Note = { ...serviceResponse.data! };
    setNotes([createdNote, ...notes]);
    setTotalNotes((prev) => prev + 1);
    setIsCreateDialogOpen(false);
    toast.success("Note created successfully");
  };

  const handleUpdateNote = async (
    noteToUpdate: UpdateNoteDTO,
    noteId: string
  ) => {
    const noteData: CreateNoteDTO = {
      title: noteToUpdate.title,
      content: noteToUpdate.content,
      categoryIds: noteToUpdate.categoryIds,
    };
    const serviceResponse = await noteService.updateNote(noteId, noteData);
    const updatedNote: Note = { ...serviceResponse.data! };
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    setIsEditDialogOpen(false);
    setCurrentNote(null);
    toast.success("Note updated successfully");
  };

  const handleDeleteNote = async (id: string) => {
    const serviceResponse = await noteService.deleteNote(id);
    if (serviceResponse.error) {
      console.error("Failed to delete note");
      return;
    }

    setNotes(notes.filter((note) => serviceResponse.data!.id !== note.id));
    toast.success("Note deleted successfully");
  };

  const handleViewNote = (note: Note) => {
    setCurrentNote(note);
    setIsViewDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditDialogOpen(true);
  };

  const handleAddCategory = async (name: string) => {
    const response = await categoryService.createCategory({ name });
    setCategories([...categories, response.data as Category]);
  };

  const startNote =
    notes.length > 0 ? currentPage * parseInt(notesLimit) + 1 : 0;
  const endNote = currentPage * parseInt(notesLimit) + notes.length;
  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-lg font-semibold md:text-3xl">Notes</h1>
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
          <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort-by" className="text-sm">
                  Sort by:
                </Label>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger id="sort-by" className="h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updatedAt.desc">
                      Updated Date (Latest)
                    </SelectItem>
                    <SelectItem value="updatedAt.asc">
                      Updated Date (Oldest)
                    </SelectItem>
                    <SelectItem value="createdAt.desc">
                      Created Date (Newest)
                    </SelectItem>
                    <SelectItem value="createdAt.asc">
                      Created Date (Oldest)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort-by" className="text-sm">
                  Show :
                </Label>
                <Select
                  value={notesLimit.toString()}
                  onValueChange={setNotesLimit}
                >
                  <SelectTrigger id="sort-by" className="h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Tabs defaultValue="all" className="w-full md:flex hidden">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All Notes
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="flex-1">
                    Categories
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    {totalNotes} notes found
                  </div>
                </TabsContent>
                <TabsContent value="categories" className="mt-4">
                  <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onChange={setSelectedCategories}
                    onAddCategory={handleAddCategory}
                  />
                </TabsContent>
              </Tabs>
              <Tabs defaultValue="categories" className="w-full flex md:hidden">
                <TabsList className="w-full">
                  <TabsTrigger value="categories" className="flex-1">
                    Categories
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="categories" className="mt-4">
                  <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onChange={setSelectedCategories}
                    onAddCategory={handleAddCategory}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="grid gap-4">
            <NoteList
              notes={notes}
              categories={categories}
              onView={handleViewNote}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startNote}-{endNote} of {totalNotes} notes
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                >
                  Previous
                </Button>
                <div className="flex items-center text-sm">
                  Page {currentPage + 1} of {maxPage}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === maxPage - 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, maxPage))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <CreateNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        categories={categories}
        onSubmit={handleCreateNote}
      />
      {currentNote && (
        <EditNoteDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          note={currentNote}
          categories={categories}
          onSubmit={handleUpdateNote}
        />
      )}
      {currentNote && (
        <ViewNoteDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          note={currentNote}
          categories={categories.filter(
            (cat) =>
              currentNote.categoryIds &&
              currentNote.categoryIds.includes(cat.id)
          )}
          onEdit={() => {
            setIsViewDialogOpen(false);
            setIsEditDialogOpen(true);
          }}
        />
      )}
    </>
  );
};

export default Home;
