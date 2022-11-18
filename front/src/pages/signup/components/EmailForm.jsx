import React from "react";

const EmailForm = (props) => {
  const { email, inputChangeHandler, emailErrMsg } = props;

  return (
    <div className="w-80 mb-1">
      <label htmlFor="email">이메일</label>
      <input
        type="email"
        id="email"
        name="email"
        className="mt-1 w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
        placeholder="이메일을 입력하세요"
        required
        value={email}
        onChange={inputChangeHandler}
      />
      <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
        {emailErrMsg}
      </div>
    </div>
  );
};

export default EmailForm;
