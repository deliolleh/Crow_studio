import React from "react";
import styled from "styled-components";

// styled
const TabsContainer = styled.div`
  border-radius: 10px;
  height: 100vh;
  margin-left: 8px;
`;


const Tabs = () => {
  return (
    <>
      <TabsContainer className="bg-component_-2_dark">
        <div>tab</div>
      </TabsContainer>
    </>
  )
}

export default Tabs;