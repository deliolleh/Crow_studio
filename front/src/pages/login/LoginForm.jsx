import React, { useState, useEffect } from "react";

const initialInputState = { email: "", password: "" }; // 초기 이메일, 비밀번호 상태
const initialErrorState = { emailErrorMsg: "", passwordErrorMsg: "" };

const LoginForm = ({ loginHandler }) => {
  const [inputs, setInputs] = useState(initialInputState); // 초기 입력
  const [errorMsgs, setErrorMsgs] = useState(initialErrorState); // 초기 에러메시지
  const { email, password } = inputs; // 이메일, 비밀번호 상태 할당
  const { emailErrorMsg, passwordErrorMsg } = errorMsgs; // 에러메시지 상태 할당

  useEffect(() => {}, [email, password, emailErrorMsg, passwordErrorMsg]);

  // 이메일 입력창 입력시 작동
  const emailChangeHandler = (e) => {
    e.preventDefault();
    setInputs((prev) => {
      return { ...prev, email: e.target.value };
    });
  };

  // 비밀번호 입력창 입력시 작동
  const passwordChangeHandler = (e) => {
    e.preventDefault();
    setInputs((prev) => {
      return { ...prev, password: e.target.value };
    });
  };

  // 폼 제출시 작동
  const submitHandler = (e) => {
    e.preventDefault();

    const loginData = { email, password };
    setErrorMsgs(initialErrorState);
    loginHandler(loginData);
  };

  return (
    <form
      method="post"
      onSubmit={submitHandler}
      className="flex flex-col items-center"
    >
      {/* Email */}
      <div className="w-full">
        <label htmlFor="email" className="">
          이메일
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="이메일을 입력하세요"
          required
          value={email}
          onChange={emailChangeHandler}
        />
        <div className="h-6 mb-2">{emailErrorMsg}</div>
      </div>

      {/* Password */}
      <div className="w-full">
        <label htmlFor="password" className="">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="비밀번호를 입력하세요"
          required
          value={password}
          onChange={passwordChangeHandler}
        />
        <div className="h-6 mb-2">{passwordErrorMsg}</div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition"
        onClick={submitHandler}
      >
        로그인
      </button>
    </form>
  );
};

export default LoginForm;
