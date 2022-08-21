import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import {jigsawTheme} from "./jigsaw-theme";


export interface EditorProps {
  value: string,
  onChange: (value: string) => void
}


export function Editor(props: EditorProps) {
  return (
    <div className="max-h-full p-4 overflow-y-scroll">
      <CodeMirror
        value={props.value}
        onChange={(value) => {
          // onChange is triggered even for external value changes, so this checks if there really was an update
          if (value !== props.value) {
            props.onChange(value);
          }
        }}
        extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
        theme={jigsawTheme}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
        }}
        className="h-full overflow-y-scroll text-base"
      />
    </div>
  );
}
