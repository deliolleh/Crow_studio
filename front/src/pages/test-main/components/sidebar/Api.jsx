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

  // const onMethodChange = (e) => {
  //   setMethod(e.target.value);
  // };
  const onMethodChange = (tempValue) => {
    setMethod(tempValue);
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
      <ApiContainer className="mb-3 bg-component_item_bg_dark flex flex-col overflow-auto">
        <div
          className="flex justify-between items-center"
          style={{ padding: 15 }}
        >
          <div className="text-xl font-bold text-white my-1">API 테스트</div>
        </div>
        {/* stroke */}
        <hr className="bg-component_dark border-0 m-0 h-[3px] min-h-[3px]" />
        <div style={{ padding: 15 }}>
          <div className="pl-1">
            <div className="text-primary_dark text-sm font-bold">
              <div className="mb-2">URI</div>
              <input
                type="text"
                onChange={onUriChange}
                value={uri}
                placeholder="address"
                className="h-[28px] w-[217px] rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-sm font-medium text-white text-left appearance-none shadow-xs focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark mb-5"
              />
              <div className="mb-2">Method</div>
              <SelectMethod onMethodChange={onMethodChange} />
              <div className="mb-2">Request</div>
              {/* <KeyValue you="request" getList={getList}/> */}
              <textarea
                name="request"
                onChange={(e) => update("request", e)}
                cols="25"
                rows="6"
                placeholder="{ key: value }"
                className="rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-sm font-medium text-white text-left appearance-none shadow-xs focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark mb-5"
              ></textarea>
              <div className="mb-2">Header</div>
              {/* <KeyValue you="header" getList={getList}/> */}
              <div className="flex flex-col w-fit items-end">
                <textarea
                  name="header"
                  onChange={(e) => update("header", e)}
                  cols="25"
                  rows="6"
                  placeholder="{ key: value } // Content-Type, Authorization, etc..."
                  className="rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-sm font-medium text-white text-left appearance-none shadow-xs focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark mb-2"
                ></textarea>
                <button
                  onClick={sendApi}
                  className="h-[26px] w-[45px] rounded-md bg-point_purple text-white"
                >전송</button>
              </div>
              {resultActive && (
                <div className="mt-5">
                  <div className="flex">
                    <div className="mr-4">소요시간 :</div>
                    <div className="text-point_yellow">{time / 100}</div>
                    <div className="ml-1">초</div>
                  </div>
                  <div className="flex mb-5">
                    <div className="mr-4">결과 :</div>
                    <div className="w-[186px] h-auto break-all text-point_yellow">{result}</div>
                  </div>
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