import React from "react";
import styled from "styled-components";

// styled
const GitContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;

const Git = () => {
  return (
    <>
      <GitContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div className="flex justify-between items-center" style={{ padding: 15 }}>
          <div className="text-xl font-bold text-white my-1">
            Git
          </div>
        </div>
        <hr className="bg-component_dark border-0 m-0" style={{ height: 3 }} />
        <div style={{ padding: 15 }}>
          <div className="pl-1">
            <div className="text-primary_dark text-sm font-bold">
              Git 연동 뭐 보여줄까요
            </div>
          </div>
        </div>
      </GitContainer>
    </>
  )
}

export default Git;