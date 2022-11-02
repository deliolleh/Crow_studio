import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../../redux/userSlice";

import LoginTitle from "./LoginTitle";
import LoginForm from "./LoginForm";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = (loginData) => {
    dispatch(login(loginData))
      .unwrap()
      .then(() => {
        alert("로그인 성공");
        navigate("/");
      })
      .catch((errorStatusCode) => {
        if (errorStatusCode === 409) {
          alert("존재하지 않는 이메일이나 비밀번호입니다");
        } else {
          alert("비상!!");
        }
      });
  };

  return (
    <section className="w-max h-max">
      <LoginTitle />
      <LoginForm onLogin={loginHandler} />
      <Link to="/signup" className="block w-full text-center">
        회원가입
      </Link>
    </section>
  );
};

export default Login;
