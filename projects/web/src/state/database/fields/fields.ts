import {z} from "zod";
import { IdField } from "../common/fields";
import isISO8601Date from 'validator/lib/isISO8601';
import {Entity, EntityDto, EntityVersion} from "../common/entity";

export enum FieldTypes {
  TEXT_SHORT = "text-short",
  TEXT_LONG = "text-long",
  OPTIONS = "options",
  URL = "url",
  NUMBER = "number",
  SCALE = "scale",
  BOOLEAN = "boolean",
  DATE = "date",
  TIMESTAMP = "timestamp"
}

/**
 * Validate if a string is a slug
 *
 * A slug is defined as a string with lowercase chars and digits with optional dashes. There can be
 * no consecutive dashes or dashes at the start or end of the string.
 * For example 'example1' and 'example-test-one1'
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isValidSlug = /^[a-z0-9](-?[a-z0-9])*$/.test

export const FieldDataBase = z.object({
  label: z.string()
    .min(1, "label length must be between 1 and 50 chars")
    .max(50, "label length must be between 1 and 50 chars"),
  required: z.boolean()
}).strict()
export type FieldDataBase = z.infer<typeof FieldDataBase>

export const FieldTextShortData = FieldDataBase.extend({
  type: z.literal(FieldTypes.TEXT_SHORT),
  value: z.string()
    .min(1, "value length must be between 1 and 100")
    .max(100, "value length must be between 1 and 100")
    .nullable()
}).strict()
export type FieldTextShortData = z.infer<typeof FieldTextShortData>

export const FieldTextLongEditMode = z.enum(["plain", "markdown"])
export type FieldTextLongEditMode = z.infer<typeof FieldTextLongEditMode>

export const FieldTextLongData = FieldDataBase.extend({
  type: z.literal(FieldTypes.TEXT_LONG),
  editMode: FieldTextLongEditMode,
  defaultRows: z.number()
    .int("defaultRows value must be a whole integer number")
    .min(1, "defaultRows value must be between 1 and 50")
    .min(50, "defaultRows value must be between 1 and 50")
    .optional(),
  value: z.string()
    .min(1, "value length must be at least 1 character")
    .nullable()
}).strict()
export type FieldTextLongData = z.infer<typeof FieldTextLongData>

export const FieldOptionsData = FieldDataBase.extend({
  type: z.literal(FieldTypes.OPTIONS),
  options: z.array(z.object({
    label: z.string(),
    slug: z.string()
      .refine(isValidSlug)
  })),
  value: z.string()
    .nullable()
}).strict()
export type FieldOptionsData = z.infer<typeof FieldOptionsData>

export const FieldURLData = FieldDataBase.extend({
  type: z.literal(FieldTypes.URL),
  value: z.string()
    .url("URL value must be a valid URL.")
    .nullable()
}).strict()
export type FieldURLData = z.infer<typeof FieldURLData>

export const FieldNumberData = FieldDataBase.extend({
  type: z.literal(FieldTypes.NUMBER),
  value: z.number()
    .nullable()
}).strict()
export type FieldNumberData = z.infer<typeof FieldNumberData>

export const _FieldScaleData_MISSING_VALIDATION = FieldDataBase.extend({
  type: z.literal(FieldTypes.SCALE),
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
export type _FieldScaleData_MISSING_VALIDATION = z.infer<typeof _FieldScaleData_MISSING_VALIDATION>

// The return of .refine is ZodEffect which can't be processed like a ZodObject (.pick, .merge etc don't work).
// This means that in order use .refine to validate WHILE ALSO using underlying ZodObject, they must be separate.
// Adding _ and _MISSING_VALIDATION is an attempt to reduce the risk of using the 'unrefined' object for validation.
// See https://github.com/colinhacks/zod/issues/2474 for more info.
export const FieldScaleData = _FieldScaleData_MISSING_VALIDATION
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

export const FieldBooleanData = z.object({
  type: z.literal(FieldTypes.BOOLEAN),
  value: z.boolean()
    .nullable()
}).strict()
export type FieldBooleanData = z.infer<typeof FieldBooleanData>

export const FieldTimestampData= z.object({
  type: z.literal(FieldTypes.TIMESTAMP),
  value: z.string().datetime()
    .nullable()
}).strict()
export type FieldTimestampData = z.infer<typeof FieldTimestampData>

export const FieldDateData= z.object({
  type: z.literal(FieldTypes.DATE),
  value: z.string()
    .nullable()
    .refine(
      (v) => {
        return v === null ? true : isISO8601Date(v)
      },
      {message: "Date must be in format YYYY-MM-DD"}
    )
}).strict()
export type FieldDateData = z.infer<typeof FieldDateData>

export const FieldData = z.union([
  FieldTextShortData,
  FieldTextLongData,
  FieldOptionsData,
  FieldURLData,
  FieldNumberData,
  FieldScaleData,
  FieldBooleanData,
  FieldTimestampData,
  FieldDateData
])

export const FieldStorage = z.union([
  FieldTextShortData.pick({type: true, value: true}).extend({id: IdField}),
  FieldTextLongData.pick({type: true, value: true}).extend({id: IdField}),
  FieldOptionsData.pick({type: true, value: true}).extend({id: IdField}),
  FieldURLData.pick({type: true, value: true}).extend({id: IdField}),
  FieldNumberData.pick({type: true, value: true}).extend({id: IdField}),
  _FieldScaleData_MISSING_VALIDATION.pick({type: true,  value: true}).extend({id: IdField}),
  FieldBooleanData.pick({type: true, value: true}).extend({id: IdField}),
  FieldTimestampData.pick({type: true, value: true}).extend({id: IdField}),
  FieldDateData.pick({type: true, value: true}).extend({id: IdField}),
])
export type FieldStorage = z.infer<typeof FieldStorage>

export const FieldEntity = Entity
export type FieldEntity = z.infer<typeof FieldEntity>

export const FieldVersion = EntityVersion.extend({
  fieldId: IdField
})
export type FieldVersion = z.infer<typeof FieldVersion>

export const FieldDto = z.union([
  EntityDto.merge(FieldTextShortData),
  EntityDto.merge(FieldTextLongData),
  EntityDto.merge(FieldOptionsData),
  EntityDto.merge(FieldURLData),
  EntityDto.merge(FieldNumberData),
  EntityDto.merge(_FieldScaleData_MISSING_VALIDATION),
  EntityDto.merge(FieldBooleanData),
  EntityDto.merge(FieldTimestampData),
  EntityDto.merge(FieldDateData)
])
export type FieldDto = z.infer<typeof FieldDto>
