import React, { useState } from "react";

const initialInputState = {
  email: "",
  nickname: "",
  password1: "",
  password2: "",
}; // 초기 이메일, 닉네임, 비밀번호1, 비밀번호2 상태

const initialErrState = {
  emailErrMsg: "",
  nicknameErrMsg: "",
  password1ErrMsg: "",
  password2ErrMsg: "",
};

const emailRegEx =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;

const SignupForm = ({ signupHandler }) => {
  const [inputs, setInputs] = useState(initialInputState); // 초기 입력
  const [errMsgs, setErrMsgs] = useState(initialErrState); // 초기 에러메시지
  const { email, nickname, password1, password2 } = inputs; // 이메일, 비밀번호 상태 할당
  const { emailErrMsg, nicknameErrMsg, password1ErrMsg, password2ErrMsg } =
    errMsgs; // 에러메시지 상태 할당

  const inputChangeHandler = (e) => {
    const eName = e.target.name;
    const eValue = e.target.value;
    if (eName === "email") {
      setInputs((prev) => {
        return { ...prev, email: eValue };
      });
    } else if (eName === "nickname") {
      setInputs((prev) => {
        return { ...prev, nickname: eValue };
      });
    } else if (eName === "password1") {
      setInputs((prev) => {
        return { ...prev, password1: eValue };
      });
    } else if (eName === "password2") {
      setInputs((prev) => {
        return { ...prev, password2: eValue };
      });
    }
  };

  const submitSignupHandler = (e) => {
    e.preventDefault();
    let isInvalid = false;
    setErrMsgs(initialErrState);
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
    if (nickname.trim().length === 0) {
      setErrMsgs((prev) => {
        return { ...prev, nicknameErrMsg: "닉네임을 입력하세요" };
      });
      isInvalid = true;
    }
    if (password1.trim().length === 0) {
      setErrMsgs((prev) => {
        return { ...prev, password1ErrMsg: "비밀번호를 입력하세요" };
      });
      isInvalid = true;
    }
    if (password2.trim().length === 0) {
      setErrMsgs((prev) => {
        return { ...prev, password2ErrMsg: "비밀번호를 한번 더 입력하세요" };
      });
      isInvalid = true;
    }
    if (password2 !== password1) {
      setErrMsgs((prev) => {
        return { ...prev, password2ErrMsg: "비밀번호가 일치하지 않습니다" };
      });
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }
    setErrMsgs(initialErrState);
    const signupData = {
      userId: email,
      userPassword: password2,
      userNickname: nickname,
    };
    signupHandler(signupData);
  };

  return (
    <form
      method="post"
      onSubmit={submitSignupHandler}
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

      {/* 닉네임 */}
      <div className="w-80 mb-1">
        <label htmlFor="nickname">닉네임</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          className="mt-1 w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="닉네임을 입력하세요"
          required
          value={nickname}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
          {nicknameErrMsg}
        </div>
      </div>

      {/* 비밀번호 1 */}
      <div className="w-80 mb-1">
        <label htmlFor="password1">비밀번호</label>
        <input
          type="password"
          id="password1"
          name="password1"
          className="mt-1 w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="비밀번호를 입력하세요"
          required
          value={password1}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
          {password1ErrMsg}
        </div>
      </div>

      {/* 비밀번호 2 */}
      <div className="w-80 mb-10">
        <label htmlFor="password2">비밀번호 확인</label>
        <input
          type="password"
          id="password2"
          name="password2"
          className="mt-1 w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="비밀번호를 한번 더 입력하세요"
          required
          value={password2}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
          {password2ErrMsg}
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className="w-80 text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition mb-4"
        onClick={submitSignupHandler}
      >
        회원가입
      </button>
    </form>
  );
};

export default SignupForm;
