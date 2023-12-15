import {z} from "zod"
import {IdField} from "../common/fields";

/**
 * Vault Settings
 */
export const VaultSettings = z.object({
  templateViews: z.array(IdField)
})

export type VaultSettings = z.infer<typeof VaultSettings>
