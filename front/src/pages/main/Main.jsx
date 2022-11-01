import React, { useState, useRef, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import SplitPane, { Pane } from "react-split-pane";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// components
import Sidebar from "./components/Sidebar";
import Directory from "./components/Directory";
import Git from "./components/Git";
import Team from "./components/Team";
import Settings from "./components/Settings";
import Tabs from "./components/Tabs";


// styled
const SidebarItems = styled.div`
  width: 292px;
  height: 100vh;
  margin-left: 3px;
`;

// beautiful-dnd
const elements = [
  { id: "one", content: "one" },
  { id: "two", content: "two" },
];


const Main = () => {
  // // *****************    codesandbox    ********************
  // const state = useAppState();
  // const actions = useActions();
  // const effects = useEffects();
  // const reaction = useReaction();
  // // editor element size 인 듯
  // const editorEl = useRef(null);
  // const contentEl = useRef(null);
  // const [showConsoleDevtool, setShowConsoleDevtool] = useState(false);
  // const [consoleDevtoolIndex, setConsoleDevtoolIndex] = useState(-1);


  // // 사이즈 변경
  // const updateEditorSize = useCallback(
  //   function updateEditorSize() {
  //     if (editorEl.current) {
  //       // 현재 브라우저 화면을 기준으로 위치 값 가져오기
  //       const { width, height } = editorEl.current.getBoundingClientRect();
  //       // 위치 값 업데이트하는 부분
  //       // effects.vscode.updateLayout(width, height);
  //     }
  //   },
  //   // [effects.vscode]
  // );

  // useEffect(() => {
  //   // 얘는 뭘까요
  //   const contentNode = contentEl.current;

  //   // 치수 조절 배치 탐지?
  //   const disposeResizeDetector = reaction(
  //     ({ preferences, workspace, editor }) => [
  //       // app/src/app/overmind/namespaces/preferences/state.ts에 있음
  //       // zenMode: 코드만 보이는 모드 같음
  //       preferences.settings.zenMode,
  //       // app/src/app/overmind/namespaces/workspace/state.ts에 있음
  //       workspace.workspaceHidden,
  //       // app/src/app/overmind/namespaces/editor/state.ts에 있음
  //       // 창 방향 미리보기
  //       editor.previewWindowOrientation,
  //     ],
  //     () => {
  //       updateEditorSize();
  //     },
  //     {
  //       immediate: true,  // 즉각적인
  //     }
  //   );

  //   // 첫번째 인자: 이벤트 유형 / 두번째 인자: 이벤트 발생시 알림받는 개체
  //   window.addEventListener('resize', updateEditorSize);

  //   // 제스처 스크롤 방지 (js 파일로 된 함수를 임포트함)
  //   preventGestureScroll(contentEl.current);

  //   // app/src/app/overmind/namespaces/editor/actions.tx에 있음
  //   // 저장 안했는데 정말 탭을 닫으실거냐는 메세지를 띄운다
  //   actions.editor.contentMounted();

  //   return () => {
  //     window.removeEventListener('resize', updateEditorSize);
  //     // clearInterval(this.interval);
  //     disposeResizeDetector();
  //     removeListener(contentNode);
  //   };
  // }, [actions.editor, effects.vscode, reaction, updateEditorSize]);

  // // 콘솔 탭 인덱스
  // const views = state.editor.devToolTabs;

  // useEffect(() => {
  //   setConsoleDevtoolIndex(() =>
  //     views.findIndex(
  //       ({ views: panes }) =>
  //         panes.findIndex(pane => pane.id === 'codesandbox.console') !== -1
  //     )
  //   );
  // }, [views]);

  // useKey(
  //   e => e.ctrlKey && e.keyCode === BACKTICK,
  //   e => {
  //     e.preventDefault();
  //     setShowConsoleDevtool(value => !value);
  //   },
  //   {},
  //   []
  // );

  // const sandbox = state.editor.currentSandbox;
  // const { preferences } = state;
  // const windowVisible = state.editor.previewWindowVisible;
  // const template = sandbox && getTemplateDefinition(sandbox.template);
  // const currentPosition = state.editor.currentDevToolsPosition; 
  // // *********************     codesandbox    *****************

  // 
  
  
  
  // split pane size
  const sizeRef = useRef();
  const [ sideBarSize, setSideBarSize ] = useState(0);

  useEffect(() => {
    setSideBarSize(sizeRef.current.getBoundingClientRect().width);
    // setSideBarSize(sizeRef.current.offsetWidth);
    console.log(sideBarSize)
    console.log(sizeRef.current.getBoundingClientRect().width)
  }, [])

  // Beautiful DND 함수형으로 바꿔주기
  const [items, setItems] = useState(elements);

  const onDragEnd = (result) => {
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  return (
    <>
      <div className="flex">
        <div ref={ sizeRef } className="flex">
          <Sidebar />
          <SidebarItems>
            <Directory />
            {/* <Git /> */}
            {/* <Team /> */}
            {/* <Settings /> */}
          </SidebarItems>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: "flex", width: `calc(100vw - ${sideBarSize}px - 30px)`, }}
              >
                <SplitPane
                  style={{ position: 'static', overflow: 'visible', width: `calc(100vw - ${sideBarSize}px - 30px)`,}}
                  split="vertical"
                  defaultSize="50%"
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <Tabs
                          provided={provided}
                          snapshot={snapshot}
                          item={item}
                        />
                      )}
                    </Draggable>
                  ))}
                </SplitPane>
              </div>
            )}
          </Droppable>
          {/* <SplitPane
            style={{ position: 'static', overflow: 'visible', width: `calc(100vw - ${sideBarSize}px - 30px)`,}}
            split="vertical"
            defaultSize="50%"
          >
            <Tabs />
            <Tabs />
          </SplitPane> */}
        </DragDropContext>
      </div>
    </>
  );
};

export default Main;
