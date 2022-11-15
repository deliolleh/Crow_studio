import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import styled from "styled-components";
import SplitPane from "react-split-pane";
import { useSelector } from "react-redux";
import { useLoading } from "@rest-hooks/hooks";
import { ResizeObserver } from "@juggle/resize-observer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Tab, Panel, helpers, ExtraButton } from "@react-tabtab-next/tabtab";

// components
import Header from "../../components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Directory from "./components/sidebar/Directory";
import Git from "./components/sidebar/Git";
import Team from "./components/sidebar/Team";
import Api from "./components/sidebar/Api";
import VariableName from "./components/sidebar/VariableName";
import Settings from "./components/sidebar/Settings";
import CustomTabs from "./components/tabs/CustomTabs";
import CustomTabs2 from "./components/tabs/CustomTabs2";

// api
import projectApi from "../../api/projectApi";

// tabtab dummy data
import {
  MakeEditorData,
  MakeConsoleData,
  CompileEditor,
} from "../main/components/tabs/makeData";

// svg
import { ReactComponent as IcAdd } from "../../assets/icons/ic_add.svg";
import userApi from "../../api/userApi";

// styled
const SidebarItems = styled.div`
  width: 292px;
  min-width: 0px;
  height: 100vh;
  margin-left: 3px;
`;

// beautiful-dnd
// fake data simple ver.
const elements = [
  { id: "one", content: "one" },
  { id: "two", content: "two" },
];

const Main = () => {
  // const teamSeq = useSelector((state) => state.team.value.teamSeq);
  const teamSeq = 4;

  // useEffect(() => {
  //   projectApi.directoryList(teamSeq).then((res) => {
  //     console.log(res.data);
  //   });
  // });

  useEffect(() => {
    userApi
      .getPersonalSetting()
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const horRef = useRef();
  const [horizontalSplit, setHorizontalSplit] = useState("50%");

  // vertical split 좌측 넓이 비율
  const verRef = useRef();
  const [verticalSplit, setVerticalSplit] = useState("75%");

  const checkSize = (type) => {
    if (type === "vertical") {
      console.log("verRef: ", verRef.current.state);
      const percentage =
        parseInt(
          (verRef.current.state.draggedSize / verRef.current.props.maxSize) *
            100
        ) + "%";
      console.log(percentage);
      setVerticalSplit(percentage);
    } else {
      const percenteage =
        parseInt(
          (horRef.current.state.draggedSize / horRef.current.props.maxSize) *
            100
        ) + "%";
      console.log(percenteage);
      setHorizontalSplit(percenteage);
      // console.log("hoRef: ", horRef.current);
      // console.log("hoRef-props-width: ", horRef.current.props.maxSize);
      // console.log("hoRef-drag-width: ", horRef.current.state.draggedSize);
    }
  };

  // sidebar click event
  const [com, setCom] = useState("디렉토리");
  // const [com, setCom] = useState(어쩌구 !== null ? 어쩌구 : "디렉토리");

  const showComponentHandler = (x) => {
    setCom(x);
  };

  // split pane size
  const sidebarSizeRef = useRef();
  const [sidebarSize, setSidebarSize] = useState(0);

  useEffect(() => {
    setSidebarSize(sidebarSizeRef.current.getBoundingClientRect().width);
  }, [sidebarSize]);

  // Beautiful-dnd
  // simple ver.
  const [items, setItems] = useState(elements);

  const onDragEnd = (result) => {
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  // tabtab
  const [activeEditor1Tab, setActiveEditor1Tab] = useState(0);
  const [activeEditor2Tab, setActiveEditor2Tab] = useState(0);
  const [editor1Tabs, setEditor1Tabs] = useState(
    MakeEditorData(2, "Editor Tab")
  );
  const [editor2Tabs, setEditor2Tabs] = useState(
    MakeEditorData(2, "Editor Tab")
  );

  // Editor 1
  const closableEditor1TabItems = useMemo(() => {
    return editor1Tabs.map((tab, index) => {
      return (
        <Tab closable key={index}>
          {tab.title}
        </Tab>
      );
    });
  }, [editor1Tabs]);

  const editor1PanelItems = useMemo(() => {
    return editor1Tabs.map((tab, index) => {
      return <Panel key={index}>{tab.content}</Panel>;
    });
  }, [editor1Tabs]);

  const handleEditor1TabChange = useCallback((index) => {
    console.log("select tab", index);
    setActiveEditor1Tab(index);
  }, []);

  const handleEditor1TabSequenceChange = useCallback(
    ({ oldIndex, newIndex }) => {
      console.log({ oldIndex, newIndex });
      setEditor1Tabs((editor1Tabs) =>
        helpers.simpleSwitch(editor1Tabs, oldIndex, newIndex)
      );
      setActiveEditor1Tab(newIndex);
    },
    []
  );

  // Editor 2
  const closableEditor2TabItems = useMemo(() => {
    return editor2Tabs.map((tab, index) => {
      return (
        <Tab closable key={index}>
          {tab.title}
        </Tab>
      );
    });
  }, [editor2Tabs]);

  const editor2PanelItems = useMemo(() => {
    return editor2Tabs.map((tab, index) => {
      return <Panel key={index}>{tab.content}</Panel>;
    });
  }, [editor2Tabs]);

  const handleEditor2TabChange = useCallback((index) => {
    console.log("select tab", index);
    setActiveEditor2Tab(index);
  }, []);

  const handleEditor2TabSequenceChange = useCallback(
    ({ oldIndex, newIndex }) => {
      console.log({ oldIndex, newIndex });
      setEditor2Tabs((editor2Tabs) =>
        helpers.simpleSwitch(editor2Tabs, oldIndex, newIndex)
      );
      setActiveEditor2Tab(newIndex);
    },
    []
  );

  return (
    <>
      <Header />
      <div className="flex mx-3">
        {/* useRef ver. */}
        <div ref={sidebarSizeRef} className="flex">
          <Sidebar onClickIcon={showComponentHandler} com={com} />
          {com === "" && (
            <SidebarItems style={{ width: "0px", margin: "0px" }} />
          )}
          {com === "디렉토리" && (
            <SidebarItems>
              <Directory />
            </SidebarItems>
          )}
          {com === "깃" && (
            <SidebarItems>
              <Git />
            </SidebarItems>
          )}
          {com === "팀" && (
            <SidebarItems>
              <Team />
            </SidebarItems>
          )}
          {com === "api" && (
            <SidebarItems>
              <Api />
            </SidebarItems>
          )}
          {com === "변수명" && (
            <SidebarItems>
              <VariableName />
            </SidebarItems>
          )}
          {com === "세팅" && (
            <SidebarItems>
              <Settings
                verticalSplit={verticalSplit}
                horizontalSplit={horizontalSplit}
                com={com}
              />
            </SidebarItems>
          )}
        </div>
        <DragDropContext onDragEnd={onDragEnd} className="">
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={
                  com === ""
                    ? {
                        display: "flex",
                        width: `calc(100vw - 108px)`,
                        height: "100vh",
                      }
                    : {
                        display: "flex",
                        width: `calc(100vw - ${sidebarSize}px - 34px)`,
                        height: "100vh",
                      }
                }
              >
                <SplitPane
                  style={{ position: "static" }}
                  split="horizontal"
                  defaultSize={verticalSplit}
                  minSize={31}
                  maxSize={670}
                  className="vertical Pane1"
                  ref={verRef}
                  onDragFinished={() => checkSize("vertical")}
                >
                  <SplitPane
                    split="vertical"
                    defaultSize={horizontalSplit}
                    minSize={31}
                    maxSize={1100}
                    onDragFinished={() => checkSize("horizontal")}
                    className="horizontal Pane1"
                    ref={horRef}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <CustomTabs
                            // beautiful-dnd
                            provided={provided}
                            snapshot={snapshot}
                            item={item}
                            // tabtab
                            showModalButton={false}
                            showArrowButton={true}
                            onTabClose={
                              item.id === "one"
                                ? (i) => {
                                    console.log("close", i);
                                    setEditor1Tabs((prev) =>
                                      prev.filter((_, idx) => idx !== i)
                                    );
                                  }
                                : (i) => {
                                    console.log("close", i);
                                    setEditor2Tabs((prev) =>
                                      prev.filter((_, idx) => idx !== i)
                                    );
                                  }
                            }
                            activeIndex={
                              item.id === "one"
                                ? activeEditor1Tab
                                : activeEditor2Tab
                              // activeEditor1Tab
                            }
                            panelItems={
                              item.id === "one"
                                ? editor1PanelItems
                                : editor2PanelItems
                              // editor1PanelItems
                            }
                            closableTabItems={
                              item.id === "one"
                                ? closableEditor1TabItems
                                : closableEditor2TabItems
                              // closableEditor1TabItems
                            }
                            onTabChange={
                              item.id === "one"
                                ? handleEditor1TabChange
                                : handleEditor2TabChange
                              // handleEditor1TabChange
                            }
                            onTabSequenceChange={
                              item.id === "one"
                                ? handleEditor1TabSequenceChange
                                : handleEditor2TabSequenceChange
                              // handleEditor1TabSequenceChange
                            }
                          />
                        )}
                      </Draggable>
                    ))}
                  </SplitPane>
                  <div style={{ marginTop: "8px" }}>
                    <CompileEditor />
                  </div>
                </SplitPane>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
};

export default Main;
