import React, { useState } from "react";

const initialErrorState = { nicknameErrorMsg: "", passwordErrorMsg: "" };

const Modify = ({ closeModify, userInfo }) => {
  const clickModifyClose = () => closeModify(false);
  const [inputValue, setInputValue] = useState({
    nickname: userInfo.myNickname,
  });
  const { nickname } = inputValue;
  const [errorMsgs, setErrorMsgs] = useState(initialErrorState);
  const { nicknameErrorMsg } = errorMsgs;

  const inputChangeHandler = (e) => {
    if (e.target.name === "nickname") {
      setInputValue((prev) => {
        return { ...prev, nickname: e.target.value };
      });
    }
  };

  return (
    <div className="w-fit h-96 px-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
      <div className="flex justify-between">
        <div className="text-white text-xl font-bold">내 정보 수정하기</div>
        <button
          className="text-white text-xl font-bold cursor-pointer"
          onClick={clickModifyClose}
        >
          X
        </button>
      </div>

      {/* Profile Image */}
      <div className="w-96 mb-6">
        <div className="text-primary_dark text-sm">프로필 사진</div>
        <div className="w-20 h-20 bg-point_purple rounded-full"></div>
      </div>

      {/* Nickname */}
      <div className="w-96">
        <label htmlFor="nickname" className="text-primary_dark text-sm">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          className="w-full text-white bg-component_item_bg_+1_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="닉네임을 입력하세요"
          required
          value={nickname}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mb-2">{nicknameErrorMsg}</div>
      </div>
    </div>
  );
};

export default Modify;
