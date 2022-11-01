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

  useEffect(() => {}, [
    email,
    nickname,
    password1,
    password2,
    emailErrorMsg,
    nicknameErrorMsg,
    password1ErrorMsg,
    password2ErrorMsg,
  ]);

  // 이메일 입력창 입력시 작동
  const emailChangeHandler = (e) => {
    e.preventDefault();
    setInputs((prev) => {
      return { ...prev, email: e.target.value };
    });
  };

  // 닉네임 입력창 입력시 작동
  const nicknameChangeHandler = (e) => {
    e.preventDefault();
    setInputs((prev) => {
      return { ...prev, nickname: e.target.value };
    });
  };

  // 비밀번호 입력창 입력시 작동
  const password1ChangeHandler = (e) => {
    e.preventDefault();
    setInputs((prev) => {
      return { ...prev, password1: e.target.value };
    });
  };

  // 비밀번호 확인 입력창 입력시 작동
  const password2ChangeHandler = (e) => {
    e.preventDefault();
    setInputs((prev) => {
      return { ...prev, password2: e.target.value };
    });
  };

  // 폼 제출시 작동
  const submitHandler = (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      console.log("비밀번호가 서로 일치하지 않음");
      return;
    }

    const signupData = {
      userId: email,
      userPassword: password1,
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
          onChange={emailChangeHandler}
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
          onChange={nicknameChangeHandler}
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
          onChange={password1ChangeHandler}
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
          onChange={password2ChangeHandler}
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
