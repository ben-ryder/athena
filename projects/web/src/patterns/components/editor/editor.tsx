import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import {jigsawTheme} from "./jigsaw-theme";
import { EditorView } from "@codemirror/view";
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link';

export interface EditorProps {
  value: string,
  onChange: (value: string) => void
}

export function Editor(props: EditorProps) {
  return (
    <div className="ath-editor">
        <CodeMirror
          value={props.value}
          onChange={(value) => {
            // onChange is triggered even for external value changes, so this checks if there really was an update
            if (value !== props.value) {
              props.onChange(value);
            }
          }}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            EditorView.lineWrapping,
            hyperLink
          ]}
          theme={jigsawTheme}
          basicSetup={{
            lineNumbers: false,
            foldGutter: true,
            highlightActiveLine: false,
            highlightSelectionMatches: false
          }}
          placeholder="start typing your markdown note..."
        />
    </div>
  );
}
