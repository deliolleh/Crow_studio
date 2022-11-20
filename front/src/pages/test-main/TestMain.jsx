import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import SplitPane from "react-split-pane";

import { getTeam } from "../../redux/teamSlice";

import fileApi from "../../api/fileApi";
import editorApi from "../../api/editorApi";
// import teamApi from "../../api/teamApi";

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
  automaticLayout: true,
  wordWrap: true,
};

const TestMain = () => {
  const dispatch = useDispatch();
  const { teamSeq } = useParams();
  // const { teamGit } = useSelector((state) => state.team.value);
  const { selectedFileName, selectedFileType, selectedFilePath } = useSelector(
    (state) => state.team.value
  );
  const { mySeq } = useSelector((state) => state.user.value);
  const [showComponent, setShowComponent] = useState("Dir");
  const [lintResultList, setLintResultList] = useState([]);

  const editorRef = useRef(null); // 에디터 내용
  const editorheightRef = useRef(); // 에디터 높이
  const [editorHeight, setEditorHeight] = useState();
  const [consoleHeight, setConsoleHeight] = useState("");

  const navigate = useNavigate();

  // 초기 팀 정보 가져옴
  useEffect(() => {
    dispatch(getTeam(teamSeq))
      .unwrap()
      .then(console.log)
      .catch((errStatusCode) => {
        console.error("errStatusCode:", errStatusCode);
        if (errStatusCode === 404) {
          navigate("/404", { replace: true });
        }
      });
  }, [dispatch, teamSeq, navigate]);

  // 파일, 폴더 클릭할 때마다 리렌더링, 파일이면 해당 내용 서버에서 받아와 에디터에 출력
  useEffect(() => {
    (async () => {
      if (selectedFileType !== "directory") {
        try {
          const filePathData = { filePath: selectedFilePath };
          const res = await fileApi.getFileContent(filePathData);
          editorRef.current.getModel().setValue(res.data.fileContent);
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [
    dispatch,
    selectedFileName,
    selectedFileType,
    selectedFilePath,
    lintResultList,
  ]);

  // 사이드바 아이콘 눌러서 해당 컴포넌트 보여주기
  const showComponentHandler = (componentName) =>
    setShowComponent(componentName);

  // 파일 저장
  const saveFileContentHandler = async () => {
    if (selectedFileType === "directory") {
      return;
    }
    try {
      // 1. 파일 포맷 요청
      const beforeFormatData = { text: editorRef.current.getValue() };
      const res1 = await editorApi.sendFormatRequest(
        "python",
        beforeFormatData
      );
      // 2. 파일 포맷 결과 받기
      const formatTicketData = { name: res1.data.data };
      const res2 = await editorApi.getFormatResult("python", formatTicketData);
      // 3. 파일 저장
      const fileContentData = {
        filePath: selectedFilePath,
        fileContent: res2.data.data,
      };
      await fileApi.saveFileContent(teamSeq, fileContentData);

      // 린트
      setLintResultList([]);
      const textCodeData = { text: fileContentData.fileContent };
      const res = await editorApi.lint("python", textCodeData);
      const warnings = res.data.data;
      const indexes = res.data.index;
      setLintResultList(
        warnings.map((warning, i) => `Line ${indexes[i]}: ${warning}`)
      );

      // 4. 파일 내용 가져오기
      const filePathData = { filePath: selectedFilePath };
      const res3 = await fileApi.getFileContent(filePathData);
      editorRef.current.getModel().setValue(res3.data.fileContent);
    } catch (err) {
      console.error(err);
    }
  };

  // 콘솔 높이 초기값 세팅
  useEffect(() => {
    const tempSize2 = editorheightRef.current.pane2.clientHeight;
    setConsoleHeight(tempSize2);
    // console.log("consoleHeight: " + consoleHeight);
  }, []);

  const checkSize = () => {
    // 에디터 높이 변경값 셋
    const tempSize = editorheightRef.current.state.pane1Size;
    setEditorHeight(tempSize);
    // console.log(
    //   "editorheightRef.current.state.pane1Size: ",
    //   editorheightRef.current.state.pane1Size
    // );
    // 콘솔 높이 변경값 셋
    const tempSize2 = editorheightRef.current.pane2.clientHeight;
    setConsoleHeight(tempSize2);
    // console.log("consoleHeight: " + consoleHeight);
  };

  // 동시 편집 파트로 이동
  const goCodeShare = () => {
    // console.log(editorRef.current.getValue());
    navigate("/project/code-share", {
      state: {
        data: editorRef.current.getValue(),
        selectedFileName,
      },
      target: "_blank",
      rel: "noopener noreferrer",
    });
  };

  return (
    <React.Fragment>
      <div className="h-full w-full">
        <Header />
        <div className="flex w-full" style={{ height: "calc(100% - 80px)" }}>
          <div className="flex">
            <Sidebar
              clickIcon={showComponentHandler}
              showComponent={showComponent}
            />
            {showComponent && (
              <SidebarItems>
                {showComponent === "Dir" && (
                  <Directory
                    teamSeq={teamSeq}
                    selectedFilePath={selectedFilePath}
                    selectedFileName={selectedFileName}
                    selectedFileType={selectedFileType}
                    saveFileContent={saveFileContentHandler}
                    goCodeShare={goCodeShare}
                  />
                )}
                {showComponent === "Git" && (
                  <Git
                    selectedFilePath={selectedFilePath}
                    teamSeq={teamSeq}
                    mySeq={mySeq}
                  />
                )}
                {showComponent === "Team" && <Team />}
                {showComponent === "Api" && <Api />}
                {showComponent === "Var" && <VariableName />}
                {showComponent === "Set" && <Settings />}
              </SidebarItems>
            )}
          </div>
          <div
            className="flex flex-col ml-[8px] mr-3 h-full"
            style={
              showComponent === ""
                ? { width: "calc(100vw - 105px)" }
                : { width: "calc(100vw - 400px)" }
            }
          >
            <SplitPane
              style={{ position: "static" }}
              split="horizontal"
              minSize={31}
              defaultSize="64%"
              className="vertical Pane1"
              ref={editorheightRef}
              onDragFinished={checkSize}
            >
              <Editor
                style={{
                  overflow: "auto",
                }}
                height={editorHeight}
                theme="vs-dark"
                defaultLanguage="python"
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
                options={editorOptions}
              />
              <ConsoleTerminal
                teamSeq={teamSeq}
                selectedFilePath={selectedFilePath}
                consoleHeight={consoleHeight}
                lintResultList={lintResultList}
                setLintResultList={setLintResultList}
              />
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
  height: 100%;
  margin-left: 3px;
`;
