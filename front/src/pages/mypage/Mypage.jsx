import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
import Profile from "./Profile";
import Modify from "./Modify";

const Mypage = () => {
  const { userSeq } = useParams();
  const { mySeq } = useSelector((state) => state.user.value);

  return (
    <div className="flex flex-col">
      <Header />
      <section className="flex md:flex-row flex-col w-screen h-screen justify-center items-center m-3 mb-6">
        {/* 프로필 */}
        <Profile userSeq={userSeq} />
        {/* 회원정보수정 */}
        {+userSeq === mySeq && <Modify />}
      </section>
    </div>
  );
};

export default Mypage;
