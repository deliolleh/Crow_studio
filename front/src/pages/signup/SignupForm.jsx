import React, { useState, useEffect } from "react";

const initialInputState = {
  email: "",
  nickname: "",
  password1: "",
  password2: "",
}; // 초기 이메일, 닉네임, 비밀번호1, 비밀번호2 상태

const initialErrorState = {
  emailErrorMsg: "",
  nicknameErrorMsg: "",
  passwordErrorMsg: "",
};

const SignupForm = ({ signupHandler }) => {
  const [inputs, setInputs] = useState(initialInputState); // 초기 입력
  const [errorMsgs, setErrorMsgs] = useState(initialErrorState); // 초기 에러메시지
  const { email, nickname, password1, password2 } = inputs; // 이메일, 비밀번호 상태 할당
  const {
    emailErrorMsg,
    nicknameErrorMsg,
    password1ErrorMsg,
    password2ErrorMsg,
  } = errorMsgs; // 에러메시지 상태 할당

  const inputChangeHandler = (e) => {
    if (e.target.name === "email") {
      setInputs((prev) => {
        return { ...prev, email: e.target.value };
      });
    } else if (e.target.name === "nickname") {
      setInputs((prev) => {
        return { ...prev, nickname: e.target.value };
      });
    } else if (e.target.name === "password1") {
      setInputs((prev) => {
        return { ...prev, password1: e.target.value };
      });
    } else if (e.target.name === "password2") {
      setInputs((prev) => {
        return { ...prev, password2: e.target.value };
      });
    }
  };

  // 폼 제출시 작동
  const submitHandler = (e) => {
    e.preventDefault();

    let isInvalid = false;
    setErrorMsgs(initialErrorState);
    if (email.trim().length === 0) {
      setErrorMsgs((prev) => {
        return { ...prev, emailErrorMsg: "이메일을 입력하세요" };
      });
      isInvalid = true;
    }
    if (nickname.trim().length === 0) {
      setErrorMsgs((prev) => {
        return { ...prev, nicknameErrorMsg: "닉네임을 입력하세요" };
      });
      isInvalid = true;
    }
    if (password1.trim().length === 0) {
      setErrorMsgs((prev) => {
        return { ...prev, password1ErrorMsg: "비밀번호를 입력하세요" };
      });
      isInvalid = true;
    }
    if (password2.trim().length === 0) {
      setErrorMsgs((prev) => {
        return { ...prev, password2ErrorMsg: "비밀번호를 한번 더 입력하세요" };
      });
      isInvalid = true;
    }
    if (password2 !== password1) {
      setErrorMsgs((prev) => {
        return { ...prev, password2ErrorMsg: "비밀번호가 일치하지 않습니다" };
      });
      isInvalid = true;
    }

    if (isInvalid) {
      return;
    }

    const signupData = {
      userId: email,
      userPassword: password2,
      userNickname: nickname,
    };
    setErrorMsgs(initialErrorState);
    signupHandler(JSON.stringify(signupData));
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

      {/* Nickname */}
      <div className="w-full">
        <label htmlFor="nickname" className="">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          className="w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="닉네임을 입력하세요"
          required
          value={nickname}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mb-2">{nicknameErrorMsg}</div>
      </div>

      {/* Password 1 */}
      <div className="w-full">
        <label htmlFor="password1" className="">
          비밀번호
        </label>
        <input
          type="password"
          id="password1"
          name="password1"
          className="w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="비밀번호를 입력하세요"
          required
          value={password1}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mb-2">{password1ErrorMsg}</div>
      </div>

      {/* Password 2 */}
      <div className="w-full">
        <label htmlFor="password2" className="">
          비밀번호 확인
        </label>
        <input
          type="password"
          id="password2"
          name="password2"
          className="w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="비밀번호를 한번 더 입력하세요"
          required
          value={password2}
          onChange={inputChangeHandler}
        />
        <div className="h-6 mb-2">{password2ErrorMsg}</div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition"
        onClick={submitHandler}
      >
        회원가입
      </button>
    </form>
  );
};

export default SignupForm;
