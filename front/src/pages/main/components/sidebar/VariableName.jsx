import React, { useState } from "react";
import styled from "styled-components";
import editorApi from "../../../../api/editorApi";

// styled
const VariableNameContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;

const VariableName = () => {
  const [variable, setVariable] = useState("");
  const [result, setResult] = useState([]);
  const [resultActive, setResultActive] = useState(false);

  const update = (e) => {
    setVariable(() => e.target.value);
  };

  const rendering = () => {
    let show = [];
    result.map((li, index) => show.push(<div key={`${index}`}>{li}</div>));
    return show;
  };

  const sendWord = (e) => {
    e.preventDefault();
    const body = JSON.stringify({
      data: variable,
    });
    editorApi
      .variableRecommend(body)
      .then((res) => {
        setResultActive(() => true);
        setResult(() => res.data.data);
      })
      .catch((err) => console.error(err));
  };

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
              <div className="mb-2">
                <input
                  type="text"
                  name="variable"
                  value={variable}
                  onChange={(e) => update(e)}
                />
                <button onClick={sendWord}>Send</button>
              </div>
              {resultActive && rendering()}
            </div>
          </div>
        </div>
      </VariableNameContainer>
    </>
  );
};

export default VariableName;
