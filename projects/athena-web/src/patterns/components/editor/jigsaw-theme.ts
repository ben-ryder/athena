import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

import {colourPalette} from "@ben-ryder/jigsaw";

export const jigsawTheme = createTheme({
  theme: 'dark',
  settings: {
    background: colourPalette.atom["700"],
    foreground: colourPalette.whiteGrey["200"],
    caret: colourPalette.teal["600"],
    selection: colourPalette.atom["500"],
    selectionMatch: colourPalette.teal["800"],
    gutterBackground: colourPalette.atom["800"],
    gutterForeground: colourPalette.whiteGrey["200"],
    gutterBorder: colourPalette.blueGrey["600"],
    lineHighlight: colourPalette.atom["500"],
  },
  styles: [
    { tag: t.comment, color: colourPalette.whiteGrey["50"]},
    { tag: t.definition(t.typeName), color: '#194a7b' },
    { tag: t.typeName, color: '#194a7b' },
    { tag: t.tagName, color: '#008a02' },
    { tag: t.variableName, color: '#1a00db' },
    { tag: t.heading1, color: colourPalette.whiteGrey["50"], class: "font-bold text-3xl mt-4 mb-2 block"},
    { tag: t.heading2, color: colourPalette.whiteGrey["50"], class: "font-bold text-2xl mt-4 mb-2 block"},
    { tag: t.heading3, color: colourPalette.whiteGrey["50"], class: "font-bold text-xl mt-4 mb-2 block"},
    { tag: t.heading4, color: colourPalette.whiteGrey["50"], class: "font-bold text-lg mt-4 mb-2 block"},
    { tag: t.heading5, color: colourPalette.whiteGrey["50"], class: "font-bold text-lg mt-4 mb-2 block"},
    { tag: t.heading6, color: colourPalette.whiteGrey["50"], class: "font-bold text-lg mt-4 mb-2 block"},
    { tag: t.emphasis, color: colourPalette.whiteGrey["50"], class: "italic"},
    { tag: t.strong, color: colourPalette.whiteGrey["50"], class: "font-bold"},
  ],
});
