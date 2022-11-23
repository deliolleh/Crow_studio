import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
// import * as monaco from "monaco-editor";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { useLocation } from "react-router-dom";

const YMonaco = () => {
  const editorRef = useRef(null);
  const location = useLocation();
  const [tick, setTick] = useState(0);
  const selectedFileName = location.state.selectedFileName;
  const data = location.state.data;

  const link = () => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      selectedFileName,
      ydoc
    );
    const ytext = ydoc.getText("monaco");

    const monacoBinding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    window.example = { provider, ydoc, ytext, monacoBinding };
  };

  useEffect(() => {
    window.addEventListener("load", link);
    if (tick < 10) {
      setTick((prev) => prev + 1);
    }

    return () => {
      window.removeEventListener("load", link);
    };
  });

  useEffect(() => {
    if (
      editorRef.current !== null &&
      !editorRef?.current.getModel().getValue()
    ) {
      editorRef.current.getModel().setValue(data);
    }
  }, []);

  return (
    <React.Fragment>
      <Editor
        style={{ overflow: "auto" }}
        height="80%"
        theme="vs-dark"
        defaultLanguage="python"
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        options={{
          scrollBeyondLastLine: false,
          fontSize: "14px",
          fontFamily: "JetBrains Mono",
          autoIndent: "advanced",
          wrappingIndent: "same",
        }}
      />
    </React.Fragment>
  );
};

export default YMonaco;
