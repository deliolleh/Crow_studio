import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useLoading } from "@rest-hooks/hooks";
import styled from "styled-components";
import SplitPane from "react-split-pane";
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

import projectApi from "../../api/projectApi";

// tabtab dummy data
import {
  MakeEditorData,
  MakeConsoleData,
} from "../main/components/tabs/makeData";

// svg
import { ReactComponent as IcAdd } from "../../assets/icons/ic_add.svg";

// styled
const SidebarItems = styled.div`
  width: 292px;
  min-width: 0px;
  height: 100vh;
  margin-left: 3px;
`;

// const ListGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr;
//   grid-gap: 8px;
// `;

// beautiful-dnd
// fake data simple ver.
const elements = [
  { id: "one", content: "one" },
  { id: "two", content: "two" },
];

// // fake data generator complex ver.
// const getItems = (count, prefix) =>
//   Array.from({ length: count }, (v, k) => k).map((k) => {
//     const randomId = Math.floor(Math.random() * 1000);
//     return {
//       id: `item-${randomId}`,
//       prefix,
//       content: `item ${randomId}`
//     };
//   });

// const removeFromList = (list, index) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(index, 1);
//   return [removed, result];
// };

// const addToList = (list, index, element) => {
//   const result = Array.from(list);
//   result.splice(index, 0, element);
//   return result;
// };

// const lists = ["pane1", "pane2"];

// const generateLists = () =>
//   lists.reduce(
//     (acc, listKey) => ({ ...acc, [listKey]: getItems(2, listKey) }),
//     {}
//   );

const Main = () => {
  const teamSeq = 4;

  const [directory, setDirectory] = useState({});
  const [fileName, setFileName] = useState("");
  const [nowAddress, setNowAddress] = useState("");

  useEffect(() => {
    projectApi
      .directoryList(teamSeq)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  // sidebar click event
  const [com, setCom] = useState("디렉토리");

  const showComponentHandler = (x) => {
    setCom(x);
  };

  // split pane size
  // useRef ver.
  const sidebarSizeRef = useRef();
  const [sidebarSize, setSidebarSize] = useState(0);

  useEffect(() => {
    setSidebarSize(() => sidebarSizeRef.current.getBoundingClientRect().width);
    // setSideBarSize(sidebarSizeRef.current.offsetWidth);
    // console.log("sidebarSize: " + sidebarSize);
    // console.log(
    //   "sidebarSizeRef.current.getBoundingClientRect().width: " +
    //     sidebarSizeRef.current.getBoundingClientRect().width
    // );
  }, [sidebarSize]);

  // editor pane height size
  // const [editorPaneSize, setEditorPaneSize] = useState(0);
  // const editorPaneSizeRef = useRef(null)

  // useEffect(() => {
  //   setEditorPaneSize(editorPaneSizeRef.current.offsetHeight);
  // })

  // Beautiful-dnd
  // simple ver.
  const [items, setItems] = useState(elements);

  const onDragEnd = (result) => {
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  // // complex ver.
  // const [elements, setElements] = React.useState(generateLists());

  // useEffect(() => {
  //   setElements(generateLists());
  // }, []);

  // const onDragEnd = (result) => {
  //   if (!result.destination) {
  //     return;
  //   }
  //   const listCopy = { ...elements };

  //   const sourceList = listCopy[result.source.droppableId];
  //   const [removedElement, newSourceList] = removeFromList(
  //     sourceList,
  //     result.source.index
  //   );
  //   listCopy[result.source.droppableId] = newSourceList;
  //   const destinationList = listCopy[result.destination.droppableId];
  //   listCopy[result.destination.droppableId] = addToList(
  //     destinationList,
  //     result.destination.index,
  //     removedElement
  //   );

  //   setElements(listCopy);
  // };

  // tabtab
  const [activeEditor1Tab, setActiveEditor1Tab] = useState(0);
  const [activeEditor2Tab, setActiveEditor2Tab] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);
  const [editor1Tabs, setEditor1Tabs] = useState(
    MakeEditorData(2, "Editor Tab")
  );
  const [editor2Tabs, setEditor2Tabs] = useState(
    MakeEditorData(2, "Editor Tab")
  );
  const [consoleTabs, setConsoleTabs] = useState(
    MakeConsoleData(1, "Console Tab")
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

  // console
  const closableTabItems2 = useMemo(() => {
    return consoleTabs.map((tab, index) => {
      return (
        <Tab closable key={index}>
          {tab.title}
        </Tab>
      );
    });
  }, [consoleTabs]);

  const panelItems2 = useMemo(() => {
    return consoleTabs.map((tab, index) => {
      return <Panel key={index}>{tab.content}</Panel>;
    });
  }, [consoleTabs]);

  const handleTabChange2 = useCallback((index) => {
    console.log("select tab", index);
    setActiveTab2(index);
  }, []);

  const handleTabSequenceChange2 = useCallback(({ oldIndex, newIndex }) => {
    console.log({ oldIndex, newIndex });
    setConsoleTabs((consoleTabs) =>
      helpers.simpleSwitch(consoleTabs, oldIndex, newIndex)
    );
    setActiveTab2(newIndex);
  }, []);

  return (
    <>
      <Header />
      <div className="flex">
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
              <Settings />
            </SidebarItems>
          )}
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
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
                        width: `calc(100vw - ${sidebarSize}px - 23px)`,
                        height: "100vh",
                      }
                }
              >
                <SplitPane
                  // style={
                  //   com === ""
                  //     ? {
                  //         position: "static",
                  //         overflow: "auto",
                  //         width: `calc(100vw - 108px)`,
                  //         height: `calc(100vh - 300px)`,
                  //       }
                  //     : {
                  //         position: "static",
                  //         overflow: "auto",
                  //         width: `calc(100vw - ${sidebarSize}px - 23px)`,
                  //         height: `calc(100vh - 300px)`,
                  //       }
                  // }
                  style={{ position: "static" }}
                  split="horizontal"
                  defaultSize="75%"
                  minSize={31}
                  maxSize={670}
                >
                  <SplitPane
                    // style={
                    //   com === ""
                    //     ? {
                    //         position: "static",
                    //         overflow: "auto",
                    //         width: `calc(100vw - 108px)`,
                    //         height: "75%",
                    //       }
                    //     : {
                    //         position: "static",
                    //         overflow: "auto",
                    //         width: `calc(100vw - ${sidebarSize}px - 23px)`,
                    //         height: "75%",
                    //       }
                    // }
                    split="vertical"
                    defaultSize="50%"
                    minSize={31}
                    maxSize={1100}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          // <Tabs2
                          //   provided={provided}
                          //   snapshot={snapshot}
                          //   item={item}
                          // />
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
                    <CustomTabs2
                      // style={{ marginTop: "8px" }}
                      // className="w-full h-full"
                      sidebarSize={sidebarSize}
                      // editorPaneSize={editorPaneSize}
                      com={com}
                      // tabtab
                      showModalButton={false}
                      showArrowButton={true}
                      onTabClose={(i) => {
                        console.log("close", i);
                        setConsoleTabs((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        );
                      }}
                      activeIndex={activeTab2}
                      panelItems={panelItems2}
                      closableTabItems={closableTabItems2}
                      onTabChange={handleTabChange2}
                      onTabSequenceChange={handleTabSequenceChange2}
                      ExtraButton={
                        <ExtraButton
                          onClick={(e) => {
                            setConsoleTabs((prev) => {
                              const newTabs = [...prev];
                              const newItem = MakeConsoleData(
                                1,
                                "New Tab " + (newTabs.length + 1),
                                false
                              )[0];
                              newTabs.push(newItem);
                              return newTabs;
                            });
                            setActiveTab2(consoleTabs.length);
                          }}
                        >
                          <IcAdd
                            style={{ width: "10px", height: "10px" }}
                            alt="add-icon"
                          />
                        </ExtraButton>
                      }
                    />
                  </div>
                </SplitPane>
              </div>
            )}
          </Droppable>
          {/*  complex ver.  */}
          {/* <SplitPane
            style={{ position: 'static', overflow: 'visible', width: `calc(100vw - ${sideBarSize}px - 30px)`,}}
            split="vertical"
            defaultSize="50%"
          >
            {lists.map((listKey) => (
              <DraggableElement
                elements={elements[listKey]}
                key={listKey}
                prefix={listKey}
              />
            ))}
          </SplitPane> */}
        </DragDropContext>
      </div>
    </>
  );
};

export default Main;
