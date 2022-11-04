// import * as React from "react";
import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import files from "./files";
import ReactTerminal from "react-terminal-component";
import { EmulatorState, FileSystem } from 'javascript-terminal';

export const MakeEditorData = (number, titlePrefix = 'Tab', useTitleCounter = true) => {
    // 에디터 파일
    const editorRef = useRef(null);
    const [fileName, setFileName] = useState("script.js");
  
    const file = files[fileName];
  
    useEffect(() => {
      editorRef.current?.focus();
    }, [file.name]);

  const data = [];


  for (let i = 0; i < number; i++) {
    data.push({
      title: useTitleCounter ? `${titlePrefix} ${i + 1}` : titlePrefix,
      content: (
        // <div>
        //   <b>Content {i + 1}</b>
        //   <p>{lorem.generateWords(15)}</p>
        // </div>
        <div>
          <Editor
            height="calc(100vh - 31px)"
            theme="vs-dark"
            // path={file.name}
            path={
              i + 1 === 1 ? "script.js" : "style.css"
            }
            // defaultLanguage={file.language}
            defaultLanguage={
              i + 1 === 1 ? "javascript" : "css"
            }
            // defaultValue={file.value}
            defaultValue={
              i + 1 === 1 ? files["script.js"].value : files["style.css"].value
            }
            onMount={(editor) => (editorRef.current = editor)}
            options={{
              scrollBeyondLastLine: false,
              fontSize: "14px",
              fontFamily: "JetBrains Mono",
            }}
          />
        </div>
      ),
    });
  }
  return data;
};

export const MakeConsoleData = (number, titlePrefix = 'Tab', useTitleCounter = true) => {
  const data = [];

  const customState = EmulatorState.create({
    'fs': FileSystem.create({
      '/home': { },
      '/home/README': {content: 'This is a text file'},
      '/home/nested/directory': {},
      '/home/nested/directory/file': {content: 'End of nested directory!'}
    })
  });

  for (let i = 0; i < number; i++) {
    data.push({
      title: useTitleCounter ? `${titlePrefix} ${i + 1}` : titlePrefix,
      content: (
        <div>
          {/* <b>Content {i + 1}</b>
          <p>{lorem.generateWords(15)}</p> */}
          <ReactTerminal
            promptSymbol='🔥>'
            theme={{
              background: '#333333',
              promptSymbolColor: '#6effe6',
              commandColor: '#fcfcfc',
              outputColor: '#fcfcfc',
              errorOutputColor: '#ff89bd',
              fontSize: '14px',
              spacing: '1.5%',
              width: '100%',
              height: 'calc(100vh - 31px)',
            }}
            emulatorState={customState}
          />
        </div>
      ),
    });
  }
  return data;
};