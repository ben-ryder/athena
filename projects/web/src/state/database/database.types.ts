import { TagsTable } from "./tags/tags.types";
import { Settings } from "./settings/settings.types";
import { ItemsTable } from "./items/items.types";
import { ViewsTable } from "./views/views.types";

/**
 * Database
 * ========================
 */
export interface VaultDatabase {
  tags: TagsTable
  items: ItemsTable
  views: ViewsTable
  settings: Settings
}
