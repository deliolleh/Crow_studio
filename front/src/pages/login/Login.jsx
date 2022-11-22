import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import userApi from "../../api/userApi";
import { getUser } from "../../redux/userSlice";

import Header from "../../components/Header";
import LoginTitle from "./LoginTitle";
import LoginForm from "./LoginForm";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (loginData) => {
    try {
      const res = await userApi.login(loginData);
      localStorage.setItem("access-token", `${res.data.jwt}`);
      dispatch(getUser());
      navigate("/");
    } catch (err) {
      if (err.response.status === 409) {
        alert("해당 아이디가 존재하지 않거나 비밀번호가 틀립니다");
      } else {
        alert("비상!!");
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <section className="p-4 w-screen h-full flex flex-wrap justify-center items-center">
        <div className="h-fit flex flex-col">
          <LoginTitle />
          <LoginForm onLogin={loginHandler} />
          <Link to="/signup" className="block w-full text-center">
            회원가입
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Login;
