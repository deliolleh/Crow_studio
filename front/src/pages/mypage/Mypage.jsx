import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
import Profile from "./Profile";
import Project from "./Project";
import Modify from "./Modify";

const Mypage = () => {
  const { userSeq } = useParams();
  const { mySeq } = useSelector((state) => state.user.value);
  const [isModify, setIsModify] = useState(false);

  const modifyHandler = (isOpen) => {
    setIsModify(isOpen);
  };

  return (
    <div className="flex flex-col">
      <Header />
      <section className="flex md:flex-row flex-col w-screen h-screen justify-center items-center m-3 mb-6">
        {/* 프로필 */}
        <Profile userSeq={userSeq} openModify={modifyHandler} />
        {/* 프로젝트 */}
        {/* {!isModify && <Project />} */}
        {/* 회원정보수정 */}
        {/* {isModify && +userSeq === mySeq && <Modify closeModify={modifyHandler} />} */}
        {+userSeq === mySeq && <Modify closeModify={modifyHandler} />}
      </section>
    </div>
  );
};

export default Mypage;
