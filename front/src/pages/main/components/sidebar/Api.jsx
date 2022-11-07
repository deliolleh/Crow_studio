import React from "react";
import { useState } from "react";
import styled from "styled-components";

import SelectMethod from "./ApiMethod";
import editorApi from "../../../../api/editorApi";

// styled
const ApiContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;

const Api = () => {
  const [uri, setUri] = useState("");
  const [method, setMethod] = useState("");
  const [request, setRequest] = useState("");
  const [header, setHeader] = useState("");
  const [resultActive, setResultActive] = useState(false);
  const [time, setTime] = useState("");
  const [result, setResult] = useState("");

  const onUriChange = (e) => {
    setUri(e.target.value);
  };

  const onMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const update = (which, e) => {
    let jsonVariable = {};
    let value = e.target.value;
    value = value.trim().slice(1, -1);
    const valLIst = value.split(",");
    valLIst.forEach((li) => {
      const cut = li.trim();
      const temp = cut.split(":");
      const key = temp[0];
      const value = temp[1];
      jsonVariable[key] = value;
    });
    if (which === "request") {
      setRequest(() => jsonVariable);
    } else {
      if (!Object.keys(jsonVariable).includes("Content-Type")) {
        jsonVariable["Content-Type"] = "application/json";
      }
      setHeader(() => jsonVariable);
    }
    console.log(request);
    console.log(header);
  };

  const sendApi = () => {
    const body = {
      api: uri,
      type: method,
      request: request,
      header: header,
    };
    // console.log(JSON.stringify(body));
    editorApi
      .apiRequest(body)
      .then((res) => {
        console.log("type", res.data.data, typeof res.data.data);
        setResultActive(() => true);
        setResult(() => JSON.stringify(res.data.data));
        setTime(() => res.data.time);
      })
      .catch((err) => console.error(err));
  };

  // 따로 컴포넌트를 받아서 거기서 데이터 가져올 때 작동시켜라고 했던 함수
  // const getList = (which, word) => {
  //   if (which === "request") {
  //     setRequest(() => word);
  //   } else {
  //     setHeader(() => word);
  //   }
  // };

  return (
    <>
      <ApiContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div
          className="flex justify-between items-center"
          style={{ padding: 15 }}
        >
          <div className="text-xl font-bold text-white my-1">Api TestS</div>
        </div>
        <hr className="bg-component_dark border-0 m-0" style={{ height: 3 }} />
        <div style={{ padding: 15 }}>
          <div className="pl-1">
            <div className="text-primary_dark text-sm font-bold">
              <div>URI</div>
              <input
                type="text"
                onChange={onUriChange}
                value={uri}
                placeholder="address"
              />
              <div>Method</div>
              <SelectMethod onMethodChange={onMethodChange} />
              <div>Request</div>
              {/* <KeyValue you="request" getList={getList}/> */}
              <textarea
                name="request"
                onChange={(e) => update("request", e)}
                cols="10"
                rows="7"
                placeholder="{ key: value }"
              ></textarea>
              <div>Header</div>
              {/* <KeyValue you="header" getList={getList}/> */}
              <textarea
                name="header"
                onChange={(e) => update("header", e)}
                cols="10"
                rows="7"
                placeholder="{ key: value } // Content-Type, Authorization, etc..."
              ></textarea>
              <button onClick={sendApi}>전송</button>
              {resultActive && (
                <div>
                  <div>소요시간 : {time / 100}초</div>
                  <div>결과</div>
                  <div>{result}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ApiContainer>
    </>
  );
};

export default Api;
