/**
 * Notes Custom Fields
 * ========================
 */
export enum CustomFieldType {
	TEXT_SHORT = "text-short",
	TEXT_LONG = "text-long",
	URL = "url",
	NUMBER = "number",
	SCALE = "scale",
	BOOLEAN = "boolean",
	DATE = "date",
	TIMESTAMP = "timestamp",
}

export interface CustomFieldBase {
	identifier: string;
	label: string;
}

export interface CustomFieldTextContent extends CustomFieldBase {
	value: string;
}
export interface CustomFieldTextShort extends CustomFieldTextContent {
	type: CustomFieldType.TEXT_SHORT;
}
export interface CustomFieldTextLong extends CustomFieldTextContent {
	type: CustomFieldType.TEXT_LONG;
}
export interface CustomFieldURL extends CustomFieldTextContent {
	type: CustomFieldType.URL;
}

export interface CustomFieldNumberContent extends CustomFieldBase {
	value: number;
}
export interface CustomFieldNumber extends CustomFieldNumberContent {
	type: CustomFieldType.NUMBER;
}
export interface CustomFieldScale extends CustomFieldNumberContent {
	type: CustomFieldType.SCALE;
	maxValue: number;
}

export interface CustomFieldBoolean extends CustomFieldBase {
	type: CustomFieldType.BOOLEAN;
	value: boolean;
}

export interface CustomFieldTimestamp extends CustomFieldBase {
	type: CustomFieldType.TIMESTAMP;
}
export interface CustomFieldDate extends CustomFieldBase {
	type: CustomFieldType.DATE;
}

export type CustomField =
	| CustomFieldTextShort
	| CustomFieldTextLong
	| CustomFieldURL
	| CustomFieldNumber
	| CustomFieldScale
	| CustomFieldBoolean
	| CustomFieldTimestamp
	| CustomFieldDate;
