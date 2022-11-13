// import * as React from "react";
import React, { useState, useEffect, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import files from "./files";
import ReactTerminal from "react-terminal-component";
import { EmulatorState, FileSystem } from "javascript-terminal";
import editorApi from "../../../../api/editorApi";

export const MakeEditorData = (
  number,
  titlePrefix = "Tab",
  useTitleCounter = true
) => {
  // 에디터 파일
  const editorRef = useRef(null);
  const [fileName, setFileName] = useState("script.js");
  const [language, setLanguage] = useState("python");

  const file = files[fileName];

  const data = [];

  useEffect(() => {
    editorRef.current?.focus();
  }, [file.name]);

  // useEffect(() => {
  //   document.addEventListener("keydown", detectKeyDown, false);
  // });

  // const detectKeyDown = (e) => {};

  // Formatting
  const format = async () => {
    // When formatting Button Click, useRef of that part's value get
    const sendCode = editorRef.current.getValue();
    const body = {
      text: sendCode,
    };
    // console.log(body);
    await editorApi.formatPut(language, body).then((res) => {
      const number = res.data.data;
      console.log("dataCome ", res.data.data);
      const body2 = {
        name: number,
      };
      editorApi
        .formatGet(language, body2)
        .then((res) => {
          console.log("updateCode: ", res.data.data);
          const summaryCode = res.data.data.trim();
          editorRef.current.getModel().setValue(summaryCode);
        })
        .catch((err) => console.error(err));
    });
  };

  // 린트 영역
  const lint = () => {
    const sendCode = editorRef.current.getValue();
    const body = {
      text: sendCode,
    };
    editorApi
      .lint(language, body)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  for (let i = 0; i < number; i++) {
    data.push({
      title: useTitleCounter ? `${titlePrefix} ${i + 1}` : titlePrefix,
      content: (
        <div>
          <button onClick={format}>포맷팅</button>
          <button onClick={lint}>린트</button>
          <Editor
            style={{ overflow: "auto" }}
            height="calc(100vh - 31px)"
            // height="100%"
            theme="vs-dark"
            // path={file.name}
            path={i + 1 === 1 ? "script.js" : "style.css"}
            // defaultLanguage={file.language}
            defaultLanguage={language}
            // defaultValue={file.value}
            // defaultValue={
            //   i + 1 === 1 ? files["script.js"].value : files["style.css"].value
            // }
            defaultValue={"#welcome python"}
            onMount={(editor) => {
              editorRef.current = editor;
              // console.log(editor);
            }}
            options={{
              scrollBeyondLastLine: false,
              fontSize: "14px",
              fontFamily: "JetBrains Mono",
              autoIndent: "advanced",
              wrappingIndent: "same",
            }}
          />
        </div>
      ),
    });
  }
  return data;
};

export const MakeConsoleData = (
  number,
  titlePrefix = "Tab",
  useTitleCounter = true
) => {
  const data = [];

  const customState = EmulatorState.create({
    fs: FileSystem.create({
      "/home": {},
      "/home/README": { content: "This is a text file" },
      "/home/nested/directory": {},
      "/home/nested/directory/file": { content: "End of nested directory!" },
    }),
  });

  for (let i = 0; i < number; i++) {
    data.push({
      title: useTitleCounter ? `${titlePrefix} ${i + 1}` : titlePrefix,
      content: (
        <div>
          {/* <b>Content {i + 1}</b>
          <p>{lorem.generateWords(15)}</p> */}
          <ReactTerminal
            style={{ overflow: "hidden" }}
            promptSymbol="🔥>"
            theme={{
              background: "#333333",
              promptSymbolColor: "#6effe6",
              commandColor: "#fcfcfc",
              outputColor: "#fcfcfc",
              errorOutputColor: "#ff89bd",
              fontSize: "14px",
              spacing: "1.5%",
              width: "100%",
              // height: "calc(100vh - 551.5px)",
              height: "calc(100vh - 50px)",
              // height: "100%",
            }}
            emulatorState={customState}
          />
        </div>
      ),
    });
  }
  return data;
};
