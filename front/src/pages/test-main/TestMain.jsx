import React, {
  useState,
  useRef,
  useEffect,
  // useCallback,
  // useMemo,
} from "react";
import styled from "styled-components";
// import SplitPane from "react-split-pane";
// import { useSelector } from "react-redux";
// import { useLoading } from "@rest-hooks/hooks";
// import { ResizeObserver } from "@juggle/resize-observer";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { Tab, Panel, helpers, ExtraButton } from "@react-tabtab-next/tabtab";

// components
import Header from "../../components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Directory from "./components/sidebar/Directory";
import Git from "./components/sidebar/Git";
import Team from "./components/sidebar/Team";
import Api from "./components/sidebar/Api";
import VariableName from "./components/sidebar/VariableName";
import Settings from "./components/sidebar/Settings";
// import CustomTabs from "./components/tabs/CustomTabs";
// import CustomTabs2 from "./components/tabs/CustomTabs2";

// api
// import projectApi from "../../api/projectApi";

// tabtab dummy data
// import {
//   MakeEditorData,
//   MakeConsoleData,
// } from "../main/components/tabs/makeData";

// svg
// import { ReactComponent as IcAdd } from "../../assets/icons/ic_add.svg";

const TestMain = () => {
  // const teamSeq = useSelector((state) => state.team.value.teamSeq);
  // const teamSeq = 4;

  const [showComponent, setShowComponent] = useState("디렉토리");

  const showComponentHandler = (x) => setShowComponent(x);

  // split pane size
  const sidebarSizeRef = useRef();
  const [sidebarSize, setSidebarSize] = useState(0);

  useEffect(() => {
    setSidebarSize(sidebarSizeRef.current.getBoundingClientRect().width);
  }, [sidebarSize]);

  return (
    <>
      <Header />
      <div className="flex">
        <div ref={sidebarSizeRef} className="flex">
          <Sidebar
            onClickIcon={showComponentHandler}
            showComponent={showComponent}
          />
          {showComponent === "" && (
            <SidebarItems style={{ width: "0px", margin: "0px" }} />
          )}
          {showComponent === "디렉토리" && (
            <SidebarItems>
              <Directory />
            </SidebarItems>
          )}
          {showComponent === "깃" && (
            <SidebarItems>
              <Git />
            </SidebarItems>
          )}
          {showComponent === "팀" && (
            <SidebarItems>
              <Team />
            </SidebarItems>
          )}
          {showComponent === "api" && (
            <SidebarItems>
              <Api />
            </SidebarItems>
          )}
          {showComponent === "변수명" && (
            <SidebarItems>
              <VariableName />
            </SidebarItems>
          )}
          {showComponent === "세팅" && (
            <SidebarItems>
              <Settings />
            </SidebarItems>
          )}
        </div>
      </div>
    </>
  );
};

export default TestMain;

const SidebarItems = styled.div`
  width: 292px;
  min-width: 0px;
  height: 100vh;
  margin-left: 3px;
`;
