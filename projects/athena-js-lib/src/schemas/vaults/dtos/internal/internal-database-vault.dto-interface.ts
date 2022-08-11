
export interface InternalDatabaseVaultDto {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  owner: string;
}