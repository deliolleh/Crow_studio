import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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
    <section className="container flex">
      {/* 프로필 */}
      <Profile userSeq={userSeq} openModify={modifyHandler} />
      {/* 프로젝트 */}
      {!isModify && <Project />}
      {/* 회원정보수정 */}
      {isModify && +userSeq === mySeq && <Modify closeModify={modifyHandler} />}
    </section>
  );
};

export default Mypage;
