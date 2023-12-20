import { TagsTable } from "./vault/tags/tags";
import { VaultSettings } from "./vault/settings/settings";
import { ItemsTable } from "./vault/items/items";
import { ViewsTable } from "./vault/views/views";

/**
 * Database
 * ========================
 */
export interface VaultDatabase {
  tags: TagsTable
  items: ItemsTable
  views: ViewsTable
  settings: VaultSettings
}
