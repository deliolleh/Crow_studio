import React, { useState } from "react";
import { useSelector } from "react-redux";

import compileApi from "../../../api/compileApi";

import { BsPlayFill } from "react-icons/bs";
import { BsStopFill } from "react-icons/bs";
import { TbTerminal } from "react-icons/tb";

const ConsoleTerminal = (props) => {
  const { teamName, projectType } = useSelector((state) => state.team.value);
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");

  const {
    teamSeq,
    selectedFilePath,
    consoleHeight,
    lintResultList,
    setLintResultList,
    setting,
  } = props;

  const changeInputData = (e) => setInputData(e.target.value);

  const startCompileHandler = async () => {
    setLintResultList([]);
    const compileData = {
      type: projectType,
      filePath: selectedFilePath,
      input: inputData,
    };
    try {
      const res = await compileApi.getCompileResult(compileData);
      setOutputData(res.data.response);
    } catch (err) {
      console.error(err);
    }
  };

  const stopCompileHandler = async () => {
    setLintResultList([]);
    const teamData = { teamSeq, teamName };
    try {
      await compileApi.stopCompile(teamData);
    } catch (err) {
      console.error(err);
    }
  };

  const inputChangeHandler = (e) => changeInputData(e);

  const consoleHeightReal = consoleHeight - 8;
  const boxHeight = consoleHeight - 88;

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
            onClick={startCompileHandler}
            className="mr-[10px] cursor-pointer"
            size="27"
          />
          <BsStopFill
            className="cursor-pointer"
            size="27"
            onClick={stopCompileHandler}
          />
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
            className="resize-none w-full h-full p-[10px] bg-component_item_bg_dark rounded-[10px] rounded-tl-[0px] text-sm font-medium text-white text-left break-all appearance-none shadow-xs focus:outline-none focus:ring-2 focus:ring-point_purple focus:border-none placeholder:text-primary_dark overflow-auto"
            style={{
              fontSize: parseInt(setting.fontSize),
              fontFamily: setting.font,
            }}
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
          <div
            className="w-full h-full p-[10px] bg-component_item_bg_+2_dark rounded-[10px] rounded-tl-[0px] text-sm font-medium text-white  overflow-auto"
            style={{
              fontSize: parseInt(setting.fontSize),
              fontFamily: setting.font,
            }}
          >
            {outputData}
            {lintResultList.length > 0 &&
              lintResultList.map((lintResult) => <div>{lintResult}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleTerminal;