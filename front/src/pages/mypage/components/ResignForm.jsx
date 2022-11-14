import React, { useState } from "react";

const ResignForm = ({ onSubmitNickname, initialNickname }) => {
  const submitHandler = (e) => {
    e.preventDefault();
    // const nicknameData = { userNickname: inputNickname };
    // onSubmitNickname(JSON.stringify(nicknameData));
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="submit"
        className="w-full text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition"
        onClick={submitHandler}
      >
        탈퇴하기
      </button>
    </div>
  );
};

export default ResignForm;
