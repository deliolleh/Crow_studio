import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../../redux/authSlice";

import LoginTitle from "./LoginTitle";
import LoginForm from "./LoginForm";

const Login = () => {
  const dispatch = useDispatch();

  const loginHandler = (loginData) => {
    console.log("stringified loginData:", loginData);

    dispatch(login(loginData))
      .unwrap()
      .then((res) => console.log("res:", res))
      .catch((err) => console.error("err:", err));
  };

  return (
    <section className="w-max h-max">
      <LoginTitle />
      <LoginForm loginHandler={loginHandler} />
      <Link to="/signup" className="block w-full text-center">
        회원가입
      </Link>
    </section>
  );
};

export default Login;
