import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import {jigsawTheme} from "./jigsaw-theme";
import { EditorView } from "@codemirror/view";
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link';
import {LegacyRef, useEffect, useRef, useState} from "react";
import {fromTextArea} from "hypermd";

export interface EditorProps {
  value: string,
  onChange: (value: string) => void
}

export function Editor(props: EditorProps) {
  let initialized = false
  const textAreaRef: LegacyRef<HTMLTextAreaElement> = useRef(null);

  useEffect(() => {
    if (textAreaRef?.current && !initialized) {
      console.log("setup");
      fromTextArea(textAreaRef.current);
      initialized = true;
    }
  }, [textAreaRef]);

  return (
    <div>
      <textarea
        ref={textAreaRef}
        value={props.value}
      ></textarea>
        {/*<CodeMirror*/}
        {/*  value={props.value}*/}
        {/*  onChange={(value) => {*/}
        {/*    // onChange is triggered even for external value changes, so this checks if there really was an update*/}
        {/*    if (value !== props.value) {*/}
        {/*      props.onChange(value);*/}
        {/*    }*/}
        {/*  }}*/}
        {/*  extensions={[*/}
        {/*    markdown({ base: markdownLanguage, codeLanguages: languages }),*/}
        {/*    EditorView.lineWrapping,*/}
        {/*    hyperLink*/}
        {/*  ]}*/}
        {/*  theme={jigsawTheme}*/}
        {/*  basicSetup={{*/}
        {/*    lineNumbers: false,*/}
        {/*    foldGutter: false,*/}
        {/*    highlightActiveLine: false,*/}
        {/*    highlightSelectionMatches: false*/}
        {/*  }}*/}
        {/*  placeholder="start typing your markdown note..."*/}
        {/*/>*/}
    </div>
  );
}
