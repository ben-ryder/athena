import { TagsTable } from "./tags/tags";
import { VaultSettings } from "./settings/settings";
import { ItemsTable } from "./items/items";
import { ViewsTable } from "./views/views";

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
