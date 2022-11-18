import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import React, { useEffect, useState } from "react";
import fileApi from "../../api/fileApi";
import Editor from "@monaco-editor/react";
import { useRef } from "react";

const YMonaco3 = ({ filePath = "35/대체왜/main.py" }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("");
  useEffect(() => {
    const path = filePath ? filePath : "68/금오/금오.py";

    const data = {
      filePath: path,
    };

    fileApi.fileCall(data).then((res) => {
      console.log(res.data);
      // editorRef.current.getModel().setValue(res.data);
      setCode(res.data);
    });
  }, []);

  const link = () => {
    const path = filePath ? filePath : "68/금오/금오.py";

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider("wss://demos.yjs.dev", path, ydoc);
    const ytext = ydoc.getText("monaco");
    ytext.insert(0, code);

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

    return () => {
      window.removeEventListener("load", link);
    };
  });

  return (
    <React.Fragment>
      <Editor
        style={{ overflow: "auto" }}
        height="calc(100vh - 31px)"
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

export default YMonaco3;
