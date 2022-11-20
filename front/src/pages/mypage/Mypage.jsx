import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
import Profile from "./Profile";
import Modify from "./Modify";

const Mypage = () => {
  const { userSeq } = useParams();
  const mySeq = useSelector((state) => state.user.value.mySeq);

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <section className="flex md:flex-row flex-col h-full justify-center items-center m-3 mb-6 overflow-auto">
        {/* 프로필 */}
        <Profile userSeq={userSeq} mySeq={mySeq} />
        {/* 회원정보수정 */}
        {+userSeq === mySeq && <Modify />}
      </section>
    </div>
  );
};

export default Mypage;
