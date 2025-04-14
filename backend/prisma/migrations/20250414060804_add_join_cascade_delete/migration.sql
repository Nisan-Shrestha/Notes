-- DropForeignKey
ALTER TABLE "NoteCategory" DROP CONSTRAINT "NoteCategory_noteId_fkey";

-- AddForeignKey
ALTER TABLE "NoteCategory" ADD CONSTRAINT "NoteCategory_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
