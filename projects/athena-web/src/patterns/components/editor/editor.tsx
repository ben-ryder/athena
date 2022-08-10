import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import {jigsawTheme} from "./jigsaw-theme";


export interface EditorProps {
  content: string,
  onContentChange: (body: string) => void
}


export function Editor(props: EditorProps) {
  return (
    <div className="max-h-full p-4 overflow-y-scroll">
      <CodeMirror
        value={props.content}
        onChange={props.onContentChange}
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
