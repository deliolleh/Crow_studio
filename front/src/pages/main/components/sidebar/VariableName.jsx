import React from "react";
import styled from "styled-components";

// styled
const VariableNameContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;

const VariableName = () => {
  return (
    <>
      <VariableNameContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div
          className="flex justify-between items-center"
          style={{ padding: 15 }}
        >
          <div className="text-xl font-bold text-white my-1">Variable Name</div>
        </div>
        <hr className="bg-component_dark border-0 m-0" style={{ height: 3 }} />
        <div style={{ padding: 15 }}>
          <div className="pl-1">
            <div className="text-primary_dark text-sm font-bold">
              변수명 추천 보여줄 거 여기에
            </div>
          </div>
        </div>
      </VariableNameContainer>
    </>
  );
};

export default VariableName;
