import React, { useState } from "react";
import editorApi from "../../../api/editorApi";
import compileApi from "../../../api/compileApi";

import { BsPlayFill } from "react-icons/bs";
import { BsStopFill } from "react-icons/bs";
import { TbTerminal } from "react-icons/tb";

export const MakeEditorData = (
  number,
  titlePrefix = "Tab",
  useTitleCounter = true
) => {
  const [fileName, setFileName] = useState("script.js");
  const [language, setLanguage] = useState("python");

  const lint = () => {
    // const sendCode = editorRef.current.getValue();
    const body = {
      // text: sendCode,
      text: "",
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
      .catch(console.error);
  };
};

const ConsoleTerminal = (props) => {
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");

  const { curPath, curType, consoleHeight } = props;

  const changeInputData = (e) => setInputData(e.target.value);

  const compileStart = () => {
    console.log("compileStart curPath:", "67/wooyoungtak/wooyoungtak.py");
    const body = {
      type: curType,
      filePath: curPath,
      input: "",
    };
    compileApi
      .compilePython(body)
      .then((res) => {
        console.log(res.data);
        setOutputData(res.data.response);
      })
      .catch(console.error);
  };

  // const compileStop = () => {
  //   setInputData("");
  //   setOutputData("");
  //   const body = {
  //     projectName: "puretest",
  //     teamSeq: 11,
  //   };
  //   compileApi
  //     .compilePythonStop(body)
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((err) => console.error(err));
  // };

  console.log("curPath:", curPath);

  const inputChangeHandler = (e) => changeInputData(e);

  const consoleHeightReal = consoleHeight - 8;
  const boxHeight = consoleHeight - 90;

  return (
    <div
      className="mt-[8px] px-3 rounded-[10px] bg-component_-2_dark"
      style={{ height: consoleHeightReal }}
    >
      {/* console 상단 */}
      <div className="flex justify-between items-center mx-[5px] py-1.5">
        <div className="flex items-center text-white font-bold text-[14px]">
          <TbTerminal className="mr-1" />
          Console
        </div>
        <div className="flex items-center">
          {/* btns */}
          <BsPlayFill
            onClick={compileStart}
            className="mr-[10px] cursor-pointer"
            size="30"
          />
          {/* <BsStopFill onClick={compileStop} size="30" /> */}
        </div>
      </div>
      {/* console 하단 */}
      <div className="flex justify-between" style={{ height: boxHeight }}>
        {/* input */}
        <div className="w-1/2 mr-1">
          <div className="flex items-center sm:w-[138px] w-full h-[31px] px-3 text-sm text-white bg-component_item_bg_dark rounded-t-[10px] border-b-2 border-point_purple">
            <div className="flex items-center truncate overflow-hidden">
              <TbTerminal className="mr-1" />
              Input
            </div>
          </div>
          <textarea
            name="input"
            value={inputData}
            onChange={inputChangeHandler}
            placeholder="Input here"
            className="resize-none w-full h-full p-[10px] bg-component_item_bg_dark rounded-[10px] rounded-tl-[0px] text-sm font-medium text-white text-left break-all appearance-none shadow-xs focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
          ></textarea>
        </div>
        {/* output */}
        <div className="w-1/2 ml-1">
          <div className="flex items-center sm:w-[138px] w-full h-[31px] px-3 text-sm text-white bg-component_item_bg_+2_dark rounded-t-[10px] border-b-2 border-point_purple">
            <div className="flex items-center truncate overflow-hidden">
              <TbTerminal className="mr-1" />
              Output
            </div>
          </div>
          <div className="w-full h-full p-[10px] bg-component_item_bg_+2_dark rounded-[10px] rounded-tl-[0px] text-sm font-medium text-white">
            {outputData}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleTerminal;
