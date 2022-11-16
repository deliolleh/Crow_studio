import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import React, { useRef } from "react";

const ydocument = new Y.Doc();
const provider = new WebsocketProvider("https://까마귀공방.com/api/share");
const type = ydocument.getText("monaco");
const editorRef = useRef(null)
const monacoBinding = new MonacoBinding(type, editorRef.current.getModel(), new Set(YMonaco), provider.awareness)

const YMonaco = () => {
  return (
    <React.Fragment>
      <Editor
        defaultLanguage="python"
        defaultValue="#Here is Code Share"
        onMount={(code) => (editorRef.current = code)}
      />
    </React.Fragment>
  )
}

export default YMonaco
