import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import SplitPane from "react-split-pane";

import { getFileContent, saveFileContent } from "../../redux/fileSlice";
import { formatPut, formatGet } from "../../redux/editorSlice";
import { compilePython } from "../../redux/compileSlice";
import { getTeam } from "../../redux/teamSlice";

import Header from "../../components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Directory from "./components/sidebar/Directory";
import Git from "./components/sidebar/Git";
import Team from "./components/sidebar/Team";
import Api from "./components/sidebar/Api";
import VariableName from "./components/sidebar/VariableName";
import Settings from "./components/sidebar/Settings";
import ConsoleTerminal from "./components/ConsoleTerminal";

const editorOptions = {
  scrollBeyondLastLine: false,
  fontSize: "14px",
  fontFamily: "JetBrains Mono",
  autoIndent: "advanced",
  wrappingIndent: "same",
};

const TestMain = () => {
  const dispatch = useDispatch();
  const { teamSeq } = useParams();
  const editorRef = useRef(null);
  const [showComponent, setShowComponent] = useState("Dir");
  const [showItem, setShowItem] = useState("Dir");
  const [curFilePath, setCurFilePath] = useState("");
  const classwatcher = document.querySelector("activeIcon")

  // 사이드바 아이템 유무로 넓이 파악
  const [ sidebarItemShow, setSidebarItemShow ] = useState(true);
  useEffect(() => {
    if (classwatcher) {
      setSidebarItemShow(true);
      console.log("sidebarItemShow: " + sidebarItemShow)
    } else {
      setSidebarItemShow(false);
      console.log("sidebarItemShow: " + sidebarItemShow)
    }
  }, [classwatcher]);

  const [curPath, setCurPath] = useState("");
  const [curName, setCurName] = useState("");
  const [curType, setCurType] = useState("");

  useEffect(() => {
    dispatch(getTeam(teamSeq))
      .unwrap()
      .then((res) => {
        setCurType(res.projectType);
        console.log(res);
      })
      .catch(console.error);
  }, []);

  const showComponentHandler = (componentName) =>
    setShowComponent(componentName);

    const showItemHandler = (item) => setShowItem(item);

  // 파일 클릭하면 내용 보여주기
  const showFileContentHandler = (type, path) => {
    if (type !== "directory") {
      const requireData = {
        filePath: path,
      };
      // 클릭한 파일 내용 가져옴
      dispatch(getFileContent(requireData))
        .unwrap()
        .then((res) => {
          editorRef.current.getModel().setValue(res);
        })
        .catch(console.error);
    }
  };

  // 파일 포매팅 후 저장
  const saveFileContentHandler = (curName, curPath) => {
    const codeData = { text: editorRef.current.getValue() };
    dispatch(formatPut({ language: "python", codeData }))
      .unwrap()
      .then((res) => {
        console.log("formatPut res:", res);
        const fileNum = { name: res.data };
        dispatch(formatGet({ language: "python", fileNum }))
          .unwrap()
          .then((res) => {
            console.log("formatGet res:", res);
            const saveFileData = {
              filePath: curPath,
              fileContent: res.data,
            };
            dispatch(saveFileContent({ teamSeq, contentData: saveFileData }))
              .unwrap()
              .then((res) => {
                console.log("saveFileContent res:", res);

                // 컴파일 이거 가져가셈
                const compileData = {
                  type: "1",
                  filePath: curPath,
                  input: "",
                };
                dispatch(compilePython({ teamSeq, compileData }))
                  .unwrap()
                  .then((res) => {
                    console.log("compilePython:", res);
                  })
                  .catch(console.error);

                const requireData = {
                  filePath: curPath,
                };
                dispatch(getFileContent(requireData))
                  .unwrap()
                  .then((res) => {
                    editorRef.current.getModel().setValue(res);
                  })
                  .catch(console.error);
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  return (
    <React.Fragment>
      <div className="h-screen w-screen">
        <Header />
        <div className="flex">
          <div className="flex">
            <Sidebar clickIcon={showItemHandler} showItem={showItem} />
            {showItem && (
              <SidebarItems>
                {showItem === "Dir" && (
                  <Directory
                    showFileContent={showFileContentHandler}
                    saveFileContent={saveFileContentHandler}
                  />
                )}
                {showItem === "Git" && <Git />}
                {showItem === "Team" && <Team />}
                {showItem === "Api" && <Api />}
                {showItem === "Var" && <VariableName />}
                {showItem === "Set" && <Settings />}
              </SidebarItems>
            )}
          </div>
          <div
            className="flex flex-col mx-[8px]"
            style={ 
              sidebarItemShow === false ? { width: "calc(100vw - 400px)" } : { width: "calc(100vw - 108px)" }
            }
          >
            <SplitPane
              style={{ position: "static" }}
              split="horizontal"
              minSize={31}
              defaultSize="64%"
              className="vertical Pane1"
            >
              <Editor
                style={{ 
                  overflow: "auto",
                }}
                height="calc(70vh - 80px)"
                theme="vs-dark"
                defaultLanguage="python"
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
                options={editorOptions}
              />

              <ConsoleTerminal curPath={curPath} curType={curType} />
            </SplitPane>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TestMain;

const SidebarItems = styled.div`
  width: 292px;
  min-width: 0px;
  height: calc(100vh -80px);
  margin-left: 3px;
`;
