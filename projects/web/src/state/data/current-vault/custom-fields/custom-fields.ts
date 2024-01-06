import {z} from "zod";
import {CreatedAtField, UpdatedAtField} from "../common/fields";
import isISO8601Date from 'validator/lib/isISO8601';

export enum CustomFieldType {
  TEXT_PLAIN = "text-plain",
  TEXT_MARKDOWN = "text-markdown",
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

export const CustomFieldBase = z.object({
  id: z.string()
    .min(1, "The id length must be between 1 and 20 chars")
    .max(20, "The id length must be between 1 and 20 chars")
    .refine(
      isValidSlug,
      {message: "id must be slug format such as 'example1' or 'example-slug-1'"}
    )
  ,
  label: z.string()
    .min(1, "The label length must be between 1 and 20 chars")
    .max(20, "The label length must be between 1 and 20 chars"),
  createdAt: CreatedAtField,
  updatedAt: UpdatedAtField
}).strict()
export type CustomFieldBase = z.infer<typeof CustomFieldBase>

export const CustomFieldTextPLain = z.object({
  type: z.literal(CustomFieldType.TEXT_PLAIN),
  rows: z.number()
    .int("rows value must be a whole integer number")
    .min(1, "rows value must be greater than or equal to 1")
    .optional(),
  value: z.string()
    .nullable()
}).strict()
export type CustomFieldTextPLain = z.infer<typeof CustomFieldTextPLain>

export const CustomFieldTextMarkdown = z.object({
  type: z.literal(CustomFieldType.TEXT_MARKDOWN),
  rows: z.number()
    .int("rows value must be a whole integer number")
    .min(1, "rows value must be greater than or equal to 1")
    .optional(),
  value: z.string()
    .nullable()
}).strict()
export type CustomFieldTextMarkdown = z.infer<typeof CustomFieldTextMarkdown>

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
  CustomFieldTextPLain,
  CustomFieldTextMarkdown,
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
  CustomFieldTextPLain.pick({id: true, value: true}),
  CustomFieldTextMarkdown.pick({id: true, value: true}),
  CustomFieldURL.pick({id: true, value: true}),
  CustomFieldNumber.pick({id: true, value: true}),
  _CustomFieldScale_MISSING_VALIDATION.pick({id: true, value: true}),
  CustomFieldBoolean.pick({id: true, value: true}),
  CustomFieldTimestamp.pick({id: true, value: true}),
  CustomFieldDate.pick({id: true, value: true})
])
export type CustomFieldStorage = z.infer<typeof CustomFieldStorage>
