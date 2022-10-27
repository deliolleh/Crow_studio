import React, { useCallback } from "react";
import { Link } from "react-router-dom";

import SignupTitle from "./SignupTitle";
import SignupForm from "./SignupForm";

const Signup = () => {
  const signupHandler = useCallback((signupData) => {
    console.log("signupData:", signupData);
  }, []);

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
