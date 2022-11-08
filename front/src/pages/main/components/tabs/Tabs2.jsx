import React from "react";
import styled from "styled-components";
// import { Draggable } from "react-beautiful-dnd";

// styled
const TabsContainer = styled.div`
  border-radius: 10px;
  height: 100vh;
  margin-left: 8px;
`;


const Tabs2 = ({ item, provided, snapshot }) => {
  return (
      <TabsContainer
        className="bg-component_-2_dark"
        ref={provided.innerRef}
        snapshot={snapshot}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div>{item.id}</div>
        <div>{item.content}</div>
      </TabsContainer>
  )
}

export default Tabs2;