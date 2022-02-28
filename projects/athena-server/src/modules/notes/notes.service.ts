import { NotesDatabaseRepository } from "./database/notes.database.repository";
import { CreateNoteDto } from "./dtos/create.notes.dto";
import { UpdateNoteDto } from "./dtos/update.notes.dto";


class NotesService {
    constructor(
       private notesDatabaseRepository: NotesDatabaseRepository = new NotesDatabaseRepository()
    ) {}

    async getAll() {
        return this.notesDatabaseRepository.getAll();
    }

    async get(noteId: string) {
        return this.notesDatabaseRepository.get(noteId);
    }

    async add(createNoteDto: CreateNoteDto) {
        return this.notesDatabaseRepository.add(createNoteDto);
    }

    async update(noteId: string, updateNoteDto: UpdateNoteDto) {
        return this.notesDatabaseRepository.update(noteId, updateNoteDto);
    }

    async delete(noteId: string) {
        return this.notesDatabaseRepository.delete(noteId);
    }
}

export default NotesService;
