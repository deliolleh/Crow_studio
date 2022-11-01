import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { signup } from "../../redux/authSlice";

import SignupTitle from "./SignupTitle";
import SignupForm from "./SignupForm";

const Signup = () => {
  const dispatch = useDispatch();

  const signupHandler = (signupData) => {
    console.log("signupData:", signupData);

    dispatch(signup(signupData))
      .unwrap()
      .then((res) => {
        console.log("res:", res);
      })
      .catch((err) => console.error("err:", err));
  };

  return (
    <section className="w-max h-max">
      <SignupTitle />
      <SignupForm signupHandler={signupHandler} />
      <Link to="/login" className="block w-full text-center">
        계정이 있으신가요? 로그인하기
      </Link>
    </section>
  );
};

export default Signup;
