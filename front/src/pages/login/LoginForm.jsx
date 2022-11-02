import React, { useState } from "react";

const initialInputState = { email: "", password: "" }; // 초기 이메일, 비밀번호 상태
const initialErrorState = { emailErrorMsg: "", passwordErrorMsg: "" };

const LoginForm = ({ onLogin }) => {
  const [inputs, setInputs] = useState(initialInputState); // 초기 입력
  const [errorMsgs, setErrorMsgs] = useState(initialErrorState); // 초기 에러메시지
  const { email, password } = inputs; // 이메일, 비밀번호 상태 할당
  const { emailErrorMsg, passwordErrorMsg } = errorMsgs; // 에러메시지 상태 할당

  // inputChangeHandler
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

  // submitHandler
  const submitHandler = (e) => {
    e.preventDefault();

    let isInvalid = false;
    setErrorMsgs(initialErrorState);
    // 이메일, 비밀번호 유효성 검사
    if (email.trim().length === 0) {
      setErrorMsgs((prev) => {
        return { ...prev, emailErrorMsg: "이메일을 입력하세요" };
      });
      isInvalid = true;
    }
    if (password.trim().length === 0) {
      setErrorMsgs((prev) => {
        return { ...prev, passwordErrorMsg: "비밀번호를 입력하세요" };
      });
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }

    const loginData = { userId: email, userPassword: password };
    setErrorMsgs(initialErrorState);
    onLogin(JSON.stringify(loginData));
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
          onChange={inputChangeHandler}
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
          onChange={inputChangeHandler}
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
