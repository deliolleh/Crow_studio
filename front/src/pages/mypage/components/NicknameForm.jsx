import React, { useState } from "react";

const NicknameForm = ({ onSubmitNickname, initialNickname }) => {
  const [inputNickname, setInputNickname] = useState(initialNickname);
  const [errMsg, setErrMsg] = useState("");

  const inputChangeHandler = (e) => setInputNickname(e.target.value);

  const submitHandler = (e) => {
    e.preventDefault();
    let isInvalid = false;
    setErrMsg("");
    if (inputNickname.trim().length === 0) {
      setErrMsg("변경할 닉네임을 입력하세요");
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }
    const nicknameData = { userNickname: inputNickname };
    setErrMsg("");
    onSubmitNickname(JSON.stringify(nicknameData));
  };

  return (
    <form
      method="post"
      onSubmit={submitHandler}
      className="flex flex-col items-center"
    >
      <div className="w-96">
        <label htmlFor="nickname" className="text-primary_dark text-sm">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          className="w-full text-white bg-component_item_bg_+1_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="변경할 닉네임을 입력하세요"
          value={inputNickname}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mb-2">{errMsg}</div>
      </div>

      <button
        type="submit"
        className="w-full text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition"
        onClick={submitHandler}
      >
        변경하기
      </button>
    </form>
  );
};

export default NicknameForm;
