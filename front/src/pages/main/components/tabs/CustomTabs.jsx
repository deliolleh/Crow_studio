import React, { memo } from "react";
import styled from "styled-components";
// import { Droppable } from "react-beautiful-dnd";
import { Tabs, DragTabList, PanelList } from "@react-tabtab-next/tabtab";
import * as customStyle from "./tabsTheme";
import { MdDragHandle } from "react-icons/md";

// styled
const TabsContainer = styled.div`
  border-radius: 10px;
  `;
  // height: 100vh;
  // margin-left: 8px;

const CustomTabs = memo(({ item, provided, snapshot, closableTabItems, panelItems, ...rest }) => {
// const CustomTabs = memo(({ item, closableTabItems, panelItems, ...rest }) => {

  return (
    <TabsContainer
      className="bg-component_-2_dark ml-2 h-full"
      ref={provided.innerRef}
      snapshot={snapshot}
      {...provided.draggableProps}
      // {...provided.dragHandleProps}
    >
      <Tabs customStyle={customStyle} {...rest}>
        <DragTabList className="flex items-center">
          <span
            {...provided.dragHandleProps}
          >
            <MdDragHandle
              className="w-5 h-4 m-2 hover:bg-point_purple hover:text-black rounded-md"
            />
          </span>
          {closableTabItems}
        </DragTabList>
        <PanelList className="h-auto">
          {panelItems}
        </PanelList>
      </Tabs>
    </TabsContainer>
  );
});

export default CustomTabs;