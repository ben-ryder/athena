
export interface DatabaseNoteDto {
  id: string;
  title: string;
  description: string | null;
  body: string,
  created_at: string;
  updated_at: string;
}