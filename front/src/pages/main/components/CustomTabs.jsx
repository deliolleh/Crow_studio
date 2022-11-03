import React, { memo } from "react";
import styled from "styled-components";
// import { Droppable } from "react-beautiful-dnd";
import { Tabs, DragTabList, PanelList } from "@react-tabtab-next/tabtab";
import * as customStyle from "./tabsTheme";

// styled
const TabsContainer = styled.div`
  border-radius: 10px;
  height: 100vh;
  margin-left: 8px;
`;

const CustomTabs = memo(({ item, provided, snapshot, closableTabItems, panelItems, ...rest }) => {

  return (
    <TabsContainer
      className="bg-component_-2_dark"
      ref={provided.innerRef}
      snapshot={snapshot}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Tabs customStyle={customStyle} {...rest}>
        <DragTabList className="flex items-center">
          {closableTabItems}
        </DragTabList>
        <PanelList>
          {panelItems}
        </PanelList>
      </Tabs>
    </TabsContainer>
  );
});

export default CustomTabs;