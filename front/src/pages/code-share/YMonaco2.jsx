import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import React, { useEffect, useState, useRef } from "react";
import fileApi from "../../api/fileApi";

const YMonaco2 = ({
  filePath = "/home/ubuntu/crow_data/38/djdj/manage.py",
}) => {
  const editorRef = useRef(null);
  const path = filePath
    ? filePath.replace("/home/ubuntu/crow_data/", "")
    : "68/금오/금오.py";
  console.log(path);
  useEffect(() => {
    const data = {
      filePath: path,
    };
    fileApi.fileCall(data).then((res) => {
      console.log(res.data);
      editorRef.current.getModel().setValue(res.data);
    });
    // fileApi.fileCall(data).then(res => codes = res.data.fileContent)
  }, [path]);

  const make = () => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider("wss://demos.yjs.dev", path, ydoc);
    const ytext = ydoc.getText("monaco");

    const monacoBinding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef]),
      provider.awareness
    );

    window.example = { provider, ydoc, ytext, monacoBinding };
  };

  useEffect(() => {
    window.addEventListener("load", make);
    return () => {
      window.removeEventListener("load", make);
    };
  }, []);

  return (
    <React.Fragment>
      <Editor
        defaultLanguage="python"
        onMount={(editor) => (editorRef.current = editor)}
        theme="vs-dark"
        options={{
          scrollBeyondLastLine: false,
          fontSize: "14px",
          fontFamily: "JetBrains Mono",
          automaticLayout: true,
        }}
        height="500px"
      />
    </React.Fragment>
  );
};

export default YMonaco2;
