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

  // 린트 영역
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

const ConsoleTerminal = () => {
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
    <div className="ml-[8px] px-3 rounded-[10px] bg-component_-2_dark">
      {/* console 상단 */}
      <div className="flex justify-between items-center mx-[5px] py-1.5">
        <div className="flex items-center text-white font-bold text-[14px]">
          <TbTerminal className="mr-1" />
          Console
        </div>
        <div className="flex items-center">
          {/* run 가능한 파일들 dropdown */}
          <select className="mt-1 mr-2 w-full text-white text-xs py-1 px-3 bg-component_item_bg_+2_dark placeholder:text-gray-300 placeholder:text-sm active:outline-none active:ring-2 active:ring-point_purple focus:outline-none focus:ring-2 focus:ring-point_purple rounded-md transition">
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
          {/* btns */}
          {/* <div
            onClick={compileStart}
            className="mr-[10px]"
          >
            start
          </div>
          <div onClick={compileStop}>stop</div> */}
          <BsPlayFill onClick={compileStart} className="mr-[10px]" size="30" />
          <BsStopFill onClick={compileStop} size="30" />
        </div>
      </div>
      {/* console 하단 */}
      <div className="flex justify-between">
        {/* input */}
        <div className="w-1/2 mr-1">
          <div className="flex items-center sm:w-[138px] w-full h-[31px] px-3 text-sm text-white bg-component_item_bg_dark rounded-t-[10px] border-b-2 border-point_purple">
            <div className="flex items-center">
              <TbTerminal className="mr-1" />
              Input
            </div>
          </div>
          <textarea
            name="input"
            value={inputData}
            onChange={(e) => changeInputData(e)}
            placeholder="Input here"
            className="resize-none w-full h-[8em] p-[10px] bg-component_item_bg_dark rounded-[10px] rounded-tl-[0px] text-sm font-medium text-white text-left break-all appearance-none shadow-xs focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
          ></textarea>
        </div>
        {/* output */}
        <div className="w-1/2 ml-1">
          <div className="flex items-center sm:w-[138px] w-full h-[31px] px-3 text-sm text-white bg-component_item_bg_+2_dark rounded-t-[10px] border-b-2 border-point_purple">
            <div className="flex items-center">
              <TbTerminal className="mr-1" />
              Output
            </div>
          </div>
          <div className="w-full h-[8em] p-[10px] bg-component_item_bg_+2_dark rounded-[10px] rounded-tl-[0px] text-sm font-medium text-white">
            {outputData}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleTerminal;
