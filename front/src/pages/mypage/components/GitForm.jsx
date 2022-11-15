import React, { useState } from "react";

const initialInputState = {
  gitUsername: "",
  gitToken: "",
};

const initialErrorState = {
  gitUsernameErrMsg: "",
  gitTokenErrMsg: "",
};

const GitForm = ({ updateGitAuth }) => {
  const [inputs, setInputs] = useState(initialInputState);
  const [errMsg, setErrMsg] = useState(initialErrorState);
  const { gitUsername, gitToken } = inputs;
  const { gitUsernameErrMsg, gitTokenErrMsg } = errMsg;

  const inputChangeHandler = (e) => {
    if (e.target.name === "gitUsername") {
      setInputs((prev) => {
        return { ...prev, gitUsername: e.target.value };
      });
    } else if (e.target.name === "gitToken") {
      setInputs((prev) => {
        return { ...prev, gitToken: e.target.value };
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let isInvalid = false;
    setErrMsg(initialErrorState);
    if (gitUsername.trim().length === 0) {
      setErrMsg((prev) => {
        return { ...prev, gitUsernameErrMsg: "깃 아이디를 입력하세요" };
      });
      isInvalid = true;
    }
    if (gitToken.trim().length === 0) {
      setErrMsg((prev) => {
        return {
          ...prev,
          gitTokenErrMsg: "깃 토큰을 입력하세요",
        };
      });
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }
    const credentialsData = {
      userGitUsername: gitUsername,
      userGitToken: gitToken,
    };
    setErrMsg(initialErrorState);
    updateGitAuth(credentialsData);
  };

  return (
    <form
      method="post"
      onSubmit={submitHandler}
      className="flex flex-col items-center mb-8 text-primary_dark"
    >
      {/* Git Username */}
      <div className="w-80">
        <label htmlFor="gitUsername" className="text-sm">
          깃 아이디
        </label>
        <input
          type="text"
          id="gitUsername"
          name="gitUsername"
          className="mt-1 w-full text-white bg-component_item_bg_+2_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-point_purple rounded-md transition"
          value={gitUsername}
          onChange={inputChangeHandler}
        />
        <div className="h-6 font-normal mt-1 ml-3 mb-0.5 text-sm text-point_purple">{gitUsernameErrMsg}</div>
      </div>

      {/* Git Token */}
      <div className="w-80 mb-2">
        <label htmlFor="gitToken" className="text-sm">
          깃 토큰
        </label>
        <input
          type="text"
          id="gitToken"
          name="gitToken"
          className="mt-1 w-full text-white bg-component_item_bg_+2_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-point_purple rounded-md transition"
          value={gitToken}
          onChange={inputChangeHandler}
        />
        <div className="h-6 font-normal mt-1 ml-3 mb-0.5 text-sm text-point_purple">{gitTokenErrMsg}</div>
      </div>

      <button
        type="submit"
        className="w-80 text-md font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition"
        onClick={submitHandler}
      >
        변경하기
      </button>
    </form>
  );
};

export default GitForm;
