import {z} from "zod";
import { CreatedAtField, IdField, UpdatedAtField } from "../common/fields";
import isISO8601Date from 'validator/lib/isISO8601';

export enum CustomFieldType {
  TEXT_SHORT = "text-short",
  TEXT_LONG = "text-long",
  URL = "url",
  NUMBER = "number",
  SCALE = "scale",
  BOOLEAN = "boolean",
  DATE = "date",
  TIMESTAMP = "timestamp"
}

/**
 * Validate a string is a slug
 *
 * A slug is defined as a string with lowercase chars and digits with optional dashes. There can be
 * no consecutive dashes or dashes at the start or end of the string.
 * For example 'example1' and 'example-test-one1'
 */
const isValidSlug = /^[a-z0-9](-?[a-z0-9])*$/.test

export const CustomFieldVisibility = z.enum(["hidden", "hidden-teaser", "visible"])
export type CustomFieldVisibility = z.infer<typeof CustomFieldVisibility>

export const CustomFieldBase = z.object({
  id: IdField,
  slug: z.string()
    .min(1, "slug length must be between 1 and 20 chars")
    .max(20, "slug length must be between 1 and 20 chars")
    .refine(
      isValidSlug,
      {message: "slug must be slug format such as 'example1' or 'example-slug-1'"}
    ),
  label: z.string()
    .min(1, "label length must be between 1 and 50 chars")
    .max(50, "label length must be between 1 and 50 chars"),
  visibility: CustomFieldVisibility,
  createdAt: CreatedAtField,
  updatedAt: UpdatedAtField
}).strict()
export type CustomFieldBase = z.infer<typeof CustomFieldBase>

export const CustomFieldTextShort = z.object({
  type: z.literal(CustomFieldType.TEXT_SHORT),
  value: z.string()
    .min(1, "value length must be between 1 and 100")
    .max(100, "value length must be between 1 and 100")
    .nullable()
}).strict()
export type CustomFieldTextShort = z.infer<typeof CustomFieldTextShort>

export const TextLongEditMode = z.enum(["plain", "markdown"])
export type TextLongEditMode = z.infer<typeof TextLongEditMode>

export const CustomFieldTextLong = z.object({
  type: z.literal(CustomFieldType.TEXT_LONG),
  defaultRows: z.number()
    .int("defaultRows value must be a whole integer number")
    .min(1, "defaultRows value must be between 1 and 50")
    .min(50, "defaultRows value must be between 1 and 50")
    .optional(),
  editMode: TextLongEditMode,
  value: z.string()
    .min(1, "value length must be at least 1 character")
    .nullable()
}).strict()
export type CustomFieldTextLong = z.infer<typeof CustomFieldTextLong>

export const CustomFieldURL = z.object({
  type: z.literal(CustomFieldType.URL),
  value: z.string()
    .url("URL value must be a valid URL.")
    .nullable()
}).strict()
export type CustomFieldURL = z.infer<typeof CustomFieldURL>

export const CustomFieldNumber = z.object({
  type: z.literal(CustomFieldType.NUMBER),
  value: z.number()
    .nullable()
}).strict()
export type CustomFieldNumber = z.infer<typeof CustomFieldNumber>

export const _CustomFieldScale_MISSING_VALIDATION = z.object({
  type: z.literal(CustomFieldType.SCALE),
  minLabel: z.string()
    .min(1, "minLabel length must be between 1 and 20 chars")
    .max(1, "minLabel length must be between 1 and 20 chars"),
  maxLabel: z.number()
    .min(1, "maxLabel length must be between 1 and 20 chars")
    .max(1, "maxLabel length must be between 1 and 20 chars"),
  // todo: allow scaleMin to be configured? Allow below 1?
  scaleMax: z.number()
    .int("scaleMax must be a whole integer number")
    .min(3, "scaleMax must be between 3 and 5")
    .max(5, "scaleMax must be between 3 and 5"),
  value: z.number()
    .int("value must be a whole integer number")
    .nullable()
})
  .strict()
export type _CustomFieldScale_MISSING_VALIDATION = z.infer<typeof _CustomFieldScale_MISSING_VALIDATION>

// The return of .refine is ZodEffect which can't be processed like a ZodObject (.pick, .merge etc don't work).
// This means that in order use .refine to validate WHILE ALSO using underlying ZodObject, they must be separate.
// Adding _ and _MISSING_VALIDATION is an attempt to reduce the risk of using the 'unrefined' object for validation.
// See https://github.com/colinhacks/zod/issues/2474 for more info.
export const CustomFieldScale = _CustomFieldScale_MISSING_VALIDATION
  // Validate that value is within the range 1 - scaleMax
  .refine(
    (data) => {
      return data.value !== null ? data.value >= 1 && data.value <= data.scaleMax : true
    },
    (data) => {
      return {
        message: `value must be between 1 and ${data.scaleMax}`
      }
    }
  )

export const CustomFieldBoolean = z.object({
  type: z.literal(CustomFieldType.BOOLEAN),
  value: z.boolean()
    .nullable()
}).strict()
export type CustomFieldBoolean = z.infer<typeof CustomFieldBoolean>

export const CustomFieldTimestamp= z.object({
  type: z.literal(CustomFieldType.TIMESTAMP),
  value: z.string().datetime()
    .nullable()
}).strict()
export type CustomFieldTimestamp = z.infer<typeof CustomFieldTimestamp>

export const CustomFieldDate= z.object({
  type: z.literal(CustomFieldType.DATE),
  value: z.string()
    .nullable()
    .refine(
      (v) => {
        return v === null ? true : isISO8601Date(v)
      },
      {message: "Date must be in format YYYY-MM-DD"}
    )
}).strict()
export type CustomFieldDate = z.infer<typeof CustomFieldDate>

export const CustomFieldEntity = z.union([
  CustomFieldTextShort,
  CustomFieldTextLong,
  CustomFieldURL,
  CustomFieldNumber,
  CustomFieldScale,
  CustomFieldBoolean,
  CustomFieldTimestamp,
  CustomFieldDate
])
export type CustomFieldEntity = z.infer<typeof CustomFieldEntity>

export const CustomFieldsTable = z.object({
  entities: z.record(z.string().uuid(), CustomFieldEntity),
  ids: z.array(CustomFieldBase.shape.id)
}).strict()
export type CustomFieldsTable =  z.infer<typeof CustomFieldsTable>

export const CustomFieldStorage = z.union([
  CustomFieldTextShort.pick({type: true, id: true, value: true}),
  CustomFieldTextLong.pick({type: true, id: true, value: true}),
  CustomFieldURL.pick({type: true, id: true, value: true}),
  CustomFieldNumber.pick({type: true, id: true, value: true}),
  _CustomFieldScale_MISSING_VALIDATION.pick({type: true, id: true, value: true}),
  CustomFieldBoolean.pick({type: true, id: true, value: true}),
  CustomFieldTimestamp.pick({type: true, id: true, value: true}),
  CustomFieldDate.pick({type: true, id: true, value: true})
])
export type CustomFieldStorage = z.infer<typeof CustomFieldStorage>
