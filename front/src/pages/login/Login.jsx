import React, { useCallback } from "react";
import { Link } from "react-router-dom";

import LoginTitle from "./LoginTitle";
import LoginForm from "./LoginForm";

const Login = () => {
  const loginHandler = useCallback((loginData) => {
    console.log("loginData:", loginData);
  }, []);

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
