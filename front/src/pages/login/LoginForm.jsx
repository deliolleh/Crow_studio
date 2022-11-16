import React, { useState } from "react";

const initialInputState = { email: "", password: "" }; // 초기 이메일, 비밀번호 상태
const initialErrState = { emailErrMsg: "", passwordErrMsg: "" };

const emailRegEx =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
// const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;

const LoginForm = ({ onLogin }) => {
  const [inputs, setInputs] = useState(initialInputState); // 초기 입력
  const [errMsgs, setErrMsgs] = useState(initialErrState); // 초기 에러메시지
  const { email, password } = inputs; // 이메일, 비밀번호 상태 할당
  const { emailErrMsg, passwordErrMsg } = errMsgs; // 에러메시지 상태 할당

  const inputChangeHandler = (e) => {
    if (e.target.name === "email") {
      setInputs((prev) => {
        return { ...prev, email: e.target.value };
      });
    } else if (e.target.name === "password") {
      setInputs((prev) => {
        return { ...prev, password: e.target.value };
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let isInvalid = false;
    setErrMsgs(initialErrState);
    // 이메일, 비밀번호 유효성 검사
    if (email.trim().length === 0) {
      setErrMsgs((prev) => {
        return { ...prev, emailErrMsg: "이메일을 입력하세요" };
      });
      isInvalid = true;
    } else if (!emailRegEx.test(email)) {
      setErrMsgs((prev) => {
        return { ...prev, emailErrMsg: "이메일 형식이 올바르지 않습니다" };
      });
      isInvalid = true;
    }
    if (password.trim().length === 0) {
      setErrMsgs((prev) => {
        return { ...prev, passwordErrMsg: "비밀번호를 입력하세요" };
      });
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }
    const loginData = { userId: email, userPassword: password };
    setErrMsgs(initialErrState);
    onLogin(loginData);
  };

  return (
    <form
      method="post"
      onSubmit={submitHandler}
      className="flex flex-col items-center"
    >
      {/* 이메일 */}
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

      {/* 비밀번호 */}
      <div className="w-80 mb-10">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="비밀번호를 입력하세요"
          required
          value={password}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
          {passwordErrMsg}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-80 text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition mb-4"
        onClick={submitHandler}
      >
        로그인
      </button>
    </form>
  );
};

export default LoginForm;
