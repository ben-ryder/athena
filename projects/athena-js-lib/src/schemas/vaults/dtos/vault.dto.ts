import {VaultContentDto} from "./vault-content.dto";

export interface VaultDto extends VaultContentDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}
