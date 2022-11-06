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

// split-pane width size useCallback ver.
const useGettingWidth = () => {
  const [sidebarSize, setSideBarSize] = useState(0);
  const sizeRef = useCallback((node) => {
    if (node !== null) {
      setSideBarSize(node.getBoundingClientRect().width);
      console.log("sidebarSize: " + sidebarSize);
    }
  }, []);
  return [sidebarSize, sizeRef];
};

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
  // sidebar click event
  const [com, setCom] = useState("디렉토리");

  const showComponentHandler = (x) => {
    setCom(x);
  };

  // split pane size
  // useRef ver.
  const sizeRef = useRef();
  const [sidebarSize, setSidebarSize] = useState(0);

  useEffect(() => {
    setSidebarSize(sizeRef.current.getBoundingClientRect().width);
    // setSideBarSize(sizeRef.current.offsetWidth);
    console.log("sidebarSize: " + sidebarSize);
    console.log(
      "sizeRef.current.getBoundingClientRect().width: " +
        sizeRef.current.getBoundingClientRect().width
    );
  }, [sidebarSize]);

  // useCallback ver.
  // const [ sidebarSize, sizeRef ] = useGettingWidth();
  // const [ lazySidebarSize, lazySizeRef ] = useGettingWidth();
  // const loading = useLoading();

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
  const [activeTab, setActiveTab] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);
  const [editorTabs, setEditorTabs] = useState(MakeEditorData(2, "Editor Tab"));
  const [consoleTabs, setConsoleTabs] = useState(
    MakeConsoleData(1, "Console Tab")
  );
  // // customArrowAuto 설정해보고 싶었는데 통하지 않았습니다,,
  // const [customArrowAuto, setCustomArrowAuto] = useState(false)
  // const [ containerWidthSize, setContainerWidthSize ] = useState(0);
  // const [ tabRefs, setTabRefs ] = useState([])
  // const getTabNode = (tab) => {
  //   return tab.__INTERNAL_NODE;
  // }

  // useEffect(() => {
  //   setContainerWidthSize(sizeRef.current.getBoundingClientRect().width);
  //   console.log("containerWidthSize: " + containerWidthSize)
  //   console.log("sizeRef.current.getBoundingClientRect().width: " + sizeRef.current.getBoundingClientRect().width)
  // }, [containerWidthSize])

  // const auto = () => {
  //   if (customArrowAuto === 'customArrowAuto') {
  //     let tabWidth = 0;
  //     customArrowAuto = false;
  //     for (let index = 0; index < tabRefs.length; index++) {
  //       const tab = getTabNode(tabRefs[index]);
  //       tabWidth += tab.current.getBoundingClientRect().width;
  //       if (tabWidth >= containerWidthSize) {
  //         customArrowAuto = true;
  //         break;
  //       }
  //     }
  //   }
  // }

  const closableTabItems = useMemo(() => {
    return editorTabs.map((tab, index) => {
      return (
        <Tab closable key={index}>
          {tab.title}
        </Tab>
      );
    });
  }, [editorTabs]);

  const panelItems = useMemo(() => {
    return editorTabs.map((tab, index) => {
      return <Panel key={index}>{tab.content}</Panel>;
    });
  }, [editorTabs]);

  const handleTabChange = useCallback((index) => {
    console.log("select tab", index);
    setActiveTab(index);
  }, []);

  const handleTabSequenceChange = useCallback(({ oldIndex, newIndex }) => {
    console.log({ oldIndex, newIndex });
    setEditorTabs((tab) =>
      helpers.simpleSwitch(editorTabs, oldIndex, newIndex)
    );
    setActiveTab(newIndex);
  }, []);

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
    setConsoleTabs((tab) =>
      helpers.simpleSwitch(consoleTabs, oldIndex, newIndex)
    );
    setActiveTab2(newIndex);
  }, []);

  return (
    <>
      <Header />
      <div className="flex">
        {/* useRef ver. */}
        <div ref={sizeRef} className="flex">
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
        {/* useCallback ver. */}
        {/* {!loading && <div ref={ lazySizeRef } className="flex">
          <Sidebar onClickIcon={showComponentHandler} com={com} />
          {com === "" && (<SidebarItems style={{ width: "0px", margin: '0px'}} />)}
          {com === "디렉토리" && (<SidebarItems><Directory /></SidebarItems>)}
          {com === "깃" && (<SidebarItems><Git /></SidebarItems>)}
          {com === "팀" && (<SidebarItems><Team /></SidebarItems>)}
          {com === "세팅" && (<SidebarItems><Settings /></SidebarItems>)}
        </div>} */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={
                  com === ""
                    ? { display: "flex", width: `calc(100vw - 108px)` }
                    : {
                        display: "flex",
                        width: `calc(100vw - ${sidebarSize}px - 23px)`,
                      }
                }
              >
                <SplitPane
                  style={
                    com === ""
                      ? {
                          position: "static",
                          overflow: "auto",
                          width: `calc(100vw - 108px)`,
                        }
                      : {
                          position: "static",
                          overflow: "auto",
                          width: `calc(100vw - ${sidebarSize}px - 23px)`,
                        }
                  }
                  split="vertical"
                  defaultSize="50%"
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
                                  setEditorTabs((prev) =>
                                    prev.filter((_, idx) => idx !== i)
                                  );
                                }
                              : (i) => {
                                  console.log("close", i);
                                  setConsoleTabs((prev) =>
                                    prev.filter((_, idx) => idx !== i)
                                  );
                                }
                          }
                          activeIndex={
                            item.id === "one" ? activeTab : activeTab2
                          }
                          panelItems={
                            item.id === "one" ? panelItems : panelItems2
                          }
                          closableTabItems={
                            item.id === "one"
                              ? closableTabItems
                              : closableTabItems2
                          }
                          onTabChange={
                            item.id === "one"
                              ? handleTabChange
                              : handleTabChange2
                          }
                          onTabSequenceChange={
                            item.id === "one"
                              ? handleTabSequenceChange
                              : handleTabSequenceChange2
                          }
                          ExtraButton={
                            item.id === "one" ? (
                              <ExtraButton
                                onClick={(e) => {
                                  setEditorTabs((prev) => {
                                    const newTabs = [...prev];
                                    const newItem = MakeEditorData(
                                      1,
                                      "New Tab " + (newTabs.length + 1),
                                      false
                                    )[0];
                                    newTabs.push(newItem);
                                    return newTabs;
                                  });
                                  setActiveTab(editorTabs.length);
                                }}
                              >
                                <IcAdd
                                  style={{ width: "10px", height: "10px" }}
                                  alt="add-icon"
                                />
                              </ExtraButton>
                            ) : (
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
                            )
                          }
                        />
                      )}
                    </Draggable>
                  ))}
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
