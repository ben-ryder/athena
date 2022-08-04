
export interface VaultWithOwnerDto {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  owner: string;
}