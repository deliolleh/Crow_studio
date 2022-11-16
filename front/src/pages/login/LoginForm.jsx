import React, { useState } from "react";

const emailRegEx =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
// const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [passwordErrMsg, setPasswordErrMsg] = useState("");

  const emailChangeHandler = (e) => setEmail(e.target.value);
  const passwordChangeHandler = (e) => setPassword(e.target.value);

  const submitLoginHandler = (e) => {
    e.preventDefault();
    let isInvalid = false;
    setEmailErrMsg("");
    setPasswordErrMsg("");
    if (email.trim().length === 0) {
      setEmailErrMsg("이메일을 입력하세요");
      isInvalid = true;
    } else if (!emailRegEx.test(email)) {
      setEmailErrMsg("이메일 형식이 올바르지 않습니다");
      isInvalid = true;
    }
    if (password.trim().length === 0) {
      setPasswordErrMsg("비밀번호를 입력하세요");
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }
    setEmailErrMsg("");
    setPasswordErrMsg("");
    const loginData = { userId: email, userPassword: password };
    onLogin(loginData);
  };

  return (
    <form
      method="post"
      onSubmit={submitLoginHandler}
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
          onChange={emailChangeHandler}
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
          onChange={passwordChangeHandler}
        />
        <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
          {passwordErrMsg}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-80 text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition mb-4"
        onClick={submitLoginHandler}
      >
        로그인
      </button>
    </form>
  );
};

export default LoginForm;
