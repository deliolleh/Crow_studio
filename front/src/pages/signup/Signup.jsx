import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { signup } from "../../redux/userSlice";

import Header from "../../components/Header";
import SignupTitle from "./SignupTitle";
import SignupForm from "./SignupForm";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signupHandler = (signupData) => {
    dispatch(signup(signupData))
      .unwrap()
      .then(() => {
        alert("회원가입 성공");
        navigate("/");
      })
      .catch((errorStatusCode) => {
        if (errorStatusCode === 409) {
          alert("이미 존재하는 아이디입니다");
        } else {
          alert("비상!!");
        }
      });
  };

  return (
    <div className="flex flex-col">
      <Header />
      <section className="w-screen h-screen my-7 flex flex-col justify-center overflow-auto">
        <SignupTitle />
        <SignupForm signupHandler={signupHandler} />
        <Link to="/login" className="block w-full text-center">
          계정이 있으신가요? 로그인하기
        </Link>
      </section>
    </div>
  );
};

export default Signup;
