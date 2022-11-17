import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Combobox, Transition, Switch } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import userApi from "../../../../api/userApi";
// styled
const SettingsContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: calc(100vh - 80px);
`;

// Combobox items
const fonts = [
  { id: 1, name: "JetBrains Mono" }, // default
  { id: 2, name: "Monospace" }, //
  { id: 3, name: "IBM Plex Sans" },
  { id: 5, name: "Inter" },
  { id: 6, name: "Courier" },
  // <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
  // <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  // <link rel="stylesheet" href="https://use.typekit.net/eqy3ulj.css">
];

const Settings = ({ verticalSplit, horizontalSplit, com }) => {
  const [query, setQuery] = useState("");

  // 에디터 라인
  // indent: 2, 살릴지 말지 고민해야함
  // const [editorFontSize, setEditorFontSize] = useState(20);
  // const [editorFont, setEditorFont] = useState("JetBrains Mono");
  // const [editorAutoLine, setEditorAutoLine] = useState(true);
  const [editorSide, setEditorSide] = useState({
    fontSize: 20,
    font: fonts[0].name,
    autoLine: true,
  });

  // 콘솔 파트
  const [consoleSide, setConsoleSide] = useState({
    fontSize: 10,
    font: "Noto Sans KR",
    icon: "아이콘그잡채",
  });

  const filteredFonts =
    query === ""
      ? fonts
      : fonts.filter((font) =>
          font.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  // useState 변경
  const editorChange = (where, e) => {
    if (where === "fontSize") {
      setEditorSide({ ...editorSide, fontSize: e.target.value });
      // setEditorFontSize(() => e.target.value);
    } else if (where === "font") {
      setEditorSide({ ...editorSide, font: e.name });
      // setEditorFont(() => e.name);
    } else {
      setEditorSide({ ...editorSide, autoLine: !editorSide.autoLine });
      // setEditorAutoLine((prev) => !prev);
    }
  };

  const consoleChange = (where, e) => {
    console.log(consoleSide);
    if (where === "fontSize") {
      setConsoleSide({ ...consoleSide, fontSize: e.target.value });
    } else if (where === "font") {
      setConsoleSide({ ...consoleSide, font: e.name });
      console.log(e.name);
    } else {
      setConsoleSide({ ...consoleSide, autoLine: e.target.value });
    }
  };

  // 성공
  const sendSetting = () => {
    const settingData = {
      // horizonSplit: horizontalSplit.replace("%", ""),
      horizonSplit: parseInt(horizontalSplit.replace("%", "")),
      // verticalSplit: verticalSplit.replace("%", ""),
      verticalSplit: parseInt(verticalSplit.replace("%", "")),
      lastTabLeft: [],
      lastTabRight: [],
      // lastSideBar: com,
      lastSideBar: 3,
      editors: editorSide,
      consoles: consoleSide,
    };

    userApi
      .setPersonalSetting(settingData)
      .then((res) => {
        console.log("성공! ", res);
      })
      .catch((err) => {
        console.error("실패! ", err);
      });
  };

  return (
    <>
      <SettingsContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div
          className="flex justify-between items-center"
          style={{ padding: 15 }}
        >
          <div className="text-xl font-bold text-white my-1">Settings</div>
        </div>
        <hr className="bg-component_dark border-0 m-0 h-[3px] min-h-[3px]" />
        <div className="" style={{ padding: 15 }}>
          <div className="pl-1">
            <label
              className="block text-primary_dark text-sm font-bold mb-2"
              htmlFor="editorFontSize"
            >
              에디터 폰트 크기
            </label>
            <input
              className="rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-xs font-medium text-white text-left appearance-none shadow-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
              style={{ height: 28, width: 217 }}
              id="editorFontSize"
              type="text"
              placeholder="Editor Font Size"
              onChange={(e) => editorChange("fontSize", e)}
            />
          </div>
          <div className="pl-1 mt-5">
            <div className="text-primary_dark text-sm font-bold ">
              에디터 폰트
            </div>
            {/* headless ui combobox */}
            <Combobox
              defaultValue={fonts[0]}
              onChange={(e) => editorChange("font", e)}
            >
              <div className="relative mt-1">
                <div
                  // className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                  className="flex justify-between items-center rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-xs font-medium text-white text-left shadow-sm hover:bg-point_purple_op20 active:outline-none active:ring-2 active:ring-point_purple"
                  style={{ height: 26, width: 217 }}
                >
                  <Combobox.Input
                    className="border-none pr-4 py-1 text-xs font-medium text-white bg-transparent 
                    focus:outline-none focus:border-none focus:ring-0"
                    displayValue={(font) => font.name}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery("")}
                >
                  <Combobox.Options
                    // className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm"
                    className="absolute left-0 z-10 mt-0.5 origin-top-right rounded-md bg-component_item_bg_+2_dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    style={{ height: 130, width: 217 }}
                  >
                    {filteredFonts.length === 0 && query !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredFonts.map((font) => (
                        <Combobox.Option
                          key={font.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-1 text-xs pl-10 pr-4 hover:bg-point_purple_op20 rounded-md ${
                              active
                                ? "bg-point_purple_op20 text-white"
                                : "text-white"
                            }`
                          }
                          value={font}
                          style={{
                            height: 26,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {font.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active
                                      ? "bg-point_purple_op20 text-point_purple"
                                      : "text-white"
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5 text-point_purple"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <div className="pl-1 mt-5">
            <label
              className="block text-primary_dark text-sm font-bold mb-2"
              htmlFor="editorIndent"
            >
              에디터 들여쓰기
            </label>
            <input
              className="rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-xs font-medium text-white text-left appearance-none shadow-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
              style={{ height: 28, width: 217 }}
              id="editorIndent"
              type="text"
              placeholder="Editor Indent"
            />
          </div>
          <div className="pl-1 mt-5 flex items-center">
            <div className="text-primary_dark text-sm font-bold ">
              에디터 자동 줄바꿈
            </div>
            <Switch
              checked={editorSide.autoLine}
              onChange={(e) => editorChange("autoLine", e)}
              className={`${
                editorSide.autoLine
                  ? "bg-point_purple"
                  : "bg-component_item_bg_+2_dark"
              }
                relative inline-flex h-[26px] w-[46px] ml-[68px] text-right shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${
                  editorSide.autoLine
                    ? "translate-x-[20px]"
                    : "translate-x-[0.5px]"
                }
                  pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          <div className="pl-1 mt-5">
            <label
              className="block text-primary_dark text-sm font-bold mb-2"
              htmlFor="consoleFontSize"
            >
              콘솔 폰트 크기
            </label>
            <input
              className="rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-xs font-medium text-white text-left appearance-none shadow-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
              style={{ height: 28, width: 217 }}
              id="consoleFontSize"
              type="text"
              placeholder="Console Font Size"
              onChange={(e) => consoleChange("fontSize", e)}
            />
          </div>
          <div className="pl-1 mt-5">
            <div className="text-primary_dark text-sm font-bold ">
              콘솔 폰트
            </div>
            {/* headless ui combobox */}
            <Combobox
              defaultValue={fonts[0]}
              onChange={(e) => consoleChange("font", e)}
            >
              <div className="relative mt-1">
                <div
                  // className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                  className="flex justify-between items-center rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-xs font-medium text-white text-left shadow-sm hover:bg-point_purple_op20 active:outline-none active:ring-2 active:ring-point_purple"
                  style={{ height: 26, width: 217 }}
                >
                  <Combobox.Input
                    className="border-none pr-4 py-1 text-xs font-medium text-white bg-transparent 
                    focus:outline-none focus:border-none focus:ring-0"
                    displayValue={(font) => font.name}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery("")}
                >
                  <Combobox.Options
                    // className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm"
                    className="absolute left-0 z-10 mt-0.5 origin-top-right rounded-md bg-component_item_bg_+2_dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    style={{ height: 130, width: 217 }}
                  >
                    {filteredFonts.length === 0 && query !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredFonts.map((font) => (
                        <Combobox.Option
                          key={font.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-1 text-xs pl-10 pr-4 hover:bg-point_purple_op20 rounded-md ${
                              active
                                ? "bg-point_purple_op20 text-white"
                                : "text-white"
                            }`
                          }
                          value={font}
                          style={{
                            height: 26,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {font.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active
                                      ? "bg-point_purple_op20 text-point_purple"
                                      : "text-white"
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5 text-point_purple"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <div className="pl-1 mt-5">
            <label
              className="block text-primary_dark text-sm font-bold mb-2"
              htmlFor="consoleIcon"
            >
              콘솔 아이콘
            </label>
            <input
              className="rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-xs font-medium text-white text-left appearance-none shadow-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
              style={{ height: 28, width: 217 }}
              id="consoleIcon"
              type="text"
              placeholder="Console Icon"
            />
          </div>
          <div>
            <button onClick={sendSetting}>저장하기</button>
          </div>
        </div>
      </SettingsContainer>
    </>
  );
};

export default Settings;
