import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Editor, { useMonaco } from "@monaco-editor/react";
import styled from "styled-components";

import { getFileContent, saveFileContent } from "../../redux/fileSlice";
import { getDirectoryList } from "../../redux/projectSlice";

import Header from "../../components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Directory from "./components/sidebar/Directory";
import Git from "./components/sidebar/Git";
import Team from "./components/sidebar/Team";
import Api from "./components/sidebar/Api";
import VariableName from "./components/sidebar/VariableName";
import Settings from "./components/sidebar/Settings";

const TestMain = () => {
  const dispatch = useDispatch();
  const { teamSeq } = useParams();
  const editorRef = useRef(null);
  const [showItem, setShowItem] = useState("Dir");
  const [curFilePath, setCurFilePath] = useState("");

  const monaco = useMonaco();
  console.log("monaco:", monaco);

  // editor.onKeyDown(function (e) {
  //   if (e.ctrlKey && e.keyCode === monaco.KeyCode.KEY_S) {
  //     e.preventDefault();
  //     console.log("keydown");
  //   }
  // });
  // editor.onKeyUp(function (e) {
  //   if (e.ctrlKey && e.keyCode === monaco.KeyCode.KEY_S) {
  //     e.preventDefault();
  //     console.log("keyup");
  //   }
  // });
  // var myBinding = editor.addCommand(
  //   monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
  //   function () {
  //     console.log("SAVE pressed!");
  //   }
  // );

  const showItemHandler = (componentName) => setShowItem(componentName);

  // 파일 클릭하면 내용 보여주기
  const showFileContentHandler = (targetType, targetPath) => {
    if (targetType === "directory") {
      console.log("디렉터리임:", targetPath);
      const DIRECTORY_DATA = {
        // rootPath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
        rootPath: `${teamSeq}/${"thisIsProjectName"}`,
        rootName: `root`,
      };
      dispatch(getDirectoryList(DIRECTORY_DATA))
        .unwrap()
        .then(console.log)
        .catch(console.error);
    } else {
      console.log(targetPath);
      const requireData = {
        filePath: targetPath,
      };
      dispatch(getFileContent(requireData))
        .unwrap()
        .then((res) => {
          console.log(res);
          setCurFilePath(targetPath);
          // setCurFileContent(res);
          editorRef.current.getModel().setValue(res);
        })
        .catch(console.error);
    }
  };

  // 파일 저장
  const saveFileContentHandler = (curName, curPath) => {
    const saveFileData = {
      filePath: curPath,
      fileContent: editorRef.current.getValue(),
    };
    dispatch(saveFileContent({ teamSeq, contentData: saveFileData }))
      .unwrap()
      .then(console.log)
      .catch(console.error);
  };

  return (
    <React.Fragment>
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
        {/* 에디터 */}
        {monaco && (
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
        )}
      </div>
    </React.Fragment>
  );
};

export default TestMain;

const SidebarItems = styled.div`
  width: 292px;
  min-width: 0px;
  height: 100vh;
  margin-left: 3px;
`;
