// import * as React from "react";
import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import files from "./files";
import ReactTerminal from "react-terminal-component";
import { EmulatorState, FileSystem } from "javascript-terminal";
import editorApi from "../../../../api/editorApi";
import compileApi from "../../../../api/compile";

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

  // 포맷팅 영역
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
        const data = res.data.data;
        const index = res.data.index;
        const length = res.data.data.length;
        let lintResult = [];
        for (let i = 0; i < length; i++) {
          const sentence = `Line ${index[i]}: ${data[i]}`;
          lintResult.push(sentence);
        }
        lintResult.sort();
        // console.log("lineResult: ", lintResult);
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
            style={{ 
              resize: "vertical",
              overflow: "auto",
             }}
            height="200px"
            // height="calc(100vh - 31px)"
            theme="vs-dark"
            // path={file.name}
            path={i + 1 === 1 ? "script.js" : "style.css"}
            // defaultLanguage={file.language}
            defaultLanguage={language}
            // defaultValue={file.value}
            // defaultValue={
            //   i + 1 === 1 ? files["script.js"].value : files["style.css"].value
            // }
            defaultValue={""}
            onMount={(editor) => (editorRef.current = editor)}
            options={{
              scrollBeyondLastLine: false,
              fontSize: "14px",
              fontFamily: "JetBrains Mono",
              automaticLayout: true,
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

export const CompileEditor = () => {
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");
  const [selectOption, setSelectOption] = useState([]);

  // 테스트를 위한 하드코딩
  const teamSeq = 11;
  const filePath = "/home/ubuntu/crow_data/11/puretest/puretest.py";
  const inputValue = "";

  const changeInputData = (e) => {
    const change = e.target.value;
    console.log(change);
    setInputData(() => change);
  };

  const compileStart = () => {
    // test용 하드코딩 data
    const body = {
      type: 1,
      filePath: filePath,
      input: inputValue,
    };

    // 파일 연결 완료시 사용할 body
    // const body = {
    //   type: type,
    //   filePath: filePath,
    //   input: inputValue
    // }
    compileApi
      .compilePython(teamSeq, body)
      .then((res) => {
        console.log(res.data);
        setOutputData(res.data);
      })
      .catch((err) => console.error(err));
  };

  const compileStop = () => {
    // stop할 때 모든 데이터 날리기
    setInputData("");
    setOutputData("");
    // 하드코딩 데이터
    const body = {
      projectName: "puretest",
      teamSeq: 11,
    };
    compileApi
      .compilePythonStop(body)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ margin: "0 10px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "0 5px",
        }}
      >
        <div>Console</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <select style={{ marginRight: "10px" }}>
            {selectOption?.map((file) => {
              const name = file.split("/")[-1];
              const folder = file.split("/")[-2];
              return (
                <option value={file}>
                  {name}, {folder}
                </option>
              );
            })}
          </select>
          <div onClick={compileStart} style={{ marginRight: "10px" }}>
            start
          </div>
          <div onClick={compileStop}>stop</div>
        </div>
      </div>
      <hr />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          paddingLeft: "2em",
          paddingRight: "2em",
          justifyContent: "space-evenly",
        }}
      >
        <div
          style={{
            width: "25%",
            height: "8em",
          }}
        >
          <div
            style={{
              fontWeight: "bolder",
            }}
          >
            Input
          </div>
          <textarea
            name="input"
            value={inputData}
            onChange={(e) => changeInputData(e)}
            placeholder="Input here"
            style={{
              resize: "none",
              width: "100%",
              height: "100%",
              padding: "10px",
            }}
          ></textarea>
        </div>
        <div
          style={{
            width: "25%",
          }}
        >
          <div
            style={{
              fontWeight: "bolder",
            }}
          >
            output
          </div>
          <div
            style={{
              width: "100%",
              height: "8em",
              backgroundColor: "#BBBBBB",
              color: "white",
              padding: "10px",
            }}
          >
            {outputData}
          </div>
        </div>
      </div>
    </div>
  );
};
