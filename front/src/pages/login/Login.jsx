import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../../redux/userSlice";

import LoginTitle from "./LoginTitle";
import LoginForm from "./LoginForm";

const Login = () => {
  const dispatch = useDispatch();

  const loginHandler = (loginData) => {
    console.log("stringified loginData:", loginData);
    dispatch(login(loginData)).unwrap().then(console.log).catch(console.err);
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
