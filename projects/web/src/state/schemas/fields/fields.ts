import {z} from "zod";
import { IdField } from "../common/fields";
import isISO8601Date from 'validator/lib/isISO8601';
import {Entity, EntityDto, EntityVersion} from "../common/entity";
import { FIELD_TYPES } from "./field-types";

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
  type: z.literal(FIELD_TYPES.textShort.identifier),
  value: z.string()
    .min(1, "value length must be between 1 and 100")
    .max(100, "value length must be between 1 and 100")
    .nullable()
}).strict()
export type FieldTextShortData = z.infer<typeof FieldTextShortData>

export const FieldTextLongData = FieldDataBase.extend({
  type: z.literal(FIELD_TYPES.textLong.identifier),
  value: z.string()
    .min(1, "value length must be at least 1 character")
    .nullable()
}).strict()
export type FieldTextLongData = z.infer<typeof FieldTextLongData>

export const FieldOptionsData = FieldDataBase.extend({
  type: z.literal(FIELD_TYPES.options.identifier),
  options: z.array(z.string()),
  value: z.string()
    .nullable()
}).strict()
export type FieldOptionsData = z.infer<typeof FieldOptionsData>

export const FieldURLData = FieldDataBase.extend({
  type: z.literal(FIELD_TYPES.url.identifier),
  value: z.string()
    .url("URL value must be a valid URL.")
    .nullable()
}).strict()
export type FieldURLData = z.infer<typeof FieldURLData>

export const FieldNumberData = FieldDataBase.extend({
  type: z.literal(FIELD_TYPES.number.identifier),
  value: z.number()
    .nullable()
}).strict()
export type FieldNumberData = z.infer<typeof FieldNumberData>

export const FieldScaleData = FieldDataBase.extend({
  type: z.literal(FIELD_TYPES.scale.identifier),
  minLabel: z.string()
    .min(1, "minLabel length must be between 1 and 20 chars")
    .max(20, "minLabel length must be between 1 and 20 chars"),
  maxLabel: z.string()
    .min(1, "maxLabel length must be between 1 and 20 chars")
    .max(20, "maxLabel length must be between 1 and 20 chars"),
  value: z.number()
    .int("value must be a whole integer number")
    .nullable()
}).strict()
export type FieldScaleData = z.infer<typeof FieldScaleData>

export const FieldBooleanData = FieldDataBase.extend({
  type: z.literal(FIELD_TYPES.boolean.identifier),
  value: z.boolean()
    .nullable()
}).strict()
export type FieldBooleanData = z.infer<typeof FieldBooleanData>

export const FieldTimestampData= FieldDataBase.extend({
  type: z.literal(FIELD_TYPES.timestamp.identifier),
  value: z.string().datetime()
    .nullable()
}).strict()
export type FieldTimestampData = z.infer<typeof FieldTimestampData>

export const FieldDateData= FieldDataBase.extend({
  type: z.literal(FIELD_TYPES.date.identifier),
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

export const FieldDefinition = z.union([
  FieldTextShortData.omit({value: true}),
  FieldTextLongData.omit({value: true}),
  FieldOptionsData.omit({value: true}),
  FieldURLData.omit({value: true}),
  FieldNumberData.omit({value: true}),
  FieldScaleData.omit({value: true}),
  FieldBooleanData.omit({value: true}),
  FieldTimestampData.omit({value: true}),
  FieldDateData.omit({value: true})
])
export type FieldDefinition = z.infer<typeof FieldDefinition>

export const FieldStorage = z.union([
  FieldTextShortData.pick({type: true, value: true}).extend({id: IdField}),
  FieldTextLongData.pick({type: true, value: true}).extend({id: IdField}),
  FieldOptionsData.pick({type: true, value: true}).extend({id: IdField}),
  FieldURLData.pick({type: true, value: true}).extend({id: IdField}),
  FieldNumberData.pick({type: true, value: true}).extend({id: IdField}),
  FieldScaleData.pick({type: true,  value: true}).extend({id: IdField}),
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
  EntityDto.extend(FieldTextShortData.shape),
  EntityDto.extend(FieldTextLongData.shape),
  EntityDto.extend(FieldOptionsData.shape),
  EntityDto.extend(FieldURLData.shape),
  EntityDto.extend(FieldNumberData.shape),
  EntityDto.extend(FieldScaleData.shape),
  EntityDto.extend(FieldBooleanData.shape),
  EntityDto.extend(FieldTimestampData.shape),
  EntityDto.extend(FieldDateData.shape)
])
export type FieldDto = z.infer<typeof FieldDto>
