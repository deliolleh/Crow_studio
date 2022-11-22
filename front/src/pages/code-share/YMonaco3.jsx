import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
// y-websocket => package.json 지울 것
import { MonacoBinding } from "y-monaco";
// import * as monaco from "monaco-editor";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const YMonaco3 = () => {
  const editorRef = useRef(null);
  const location = useLocation();
  const [tick, setTick] = useState(0);
  const selectedFileName = location.state.selectedFileName;
  const data = location.state.data;

  const navigate = useNavigate();

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(selectedFileName, ydoc);
    const ytext = ydoc.getText("monaco");
    console.log("ytext: ", ytext);

    const monacoBinding = new MonacoBinding(
      ytext,
      editorRef?.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    window.example = { provider, ydoc, ytext, monacoBinding };
    if (
      editorRef.current !== null &&
      !editorRef?.current.getModel().getValue()
    ) {
      editorRef.current.getModel().setValue(data);
    }
    setTick((prev) => prev + 1);
  }, [data, selectedFileName, tick]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      <div>
        <div onClick={goBack} style={{ cursor: "pointer" }}>
          뒤로가기
        </div>
      </div>
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
