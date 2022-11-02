import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getMypage } from "../../redux/userSlice";

import Profile from "./Profile";
import Project from "./Project";
import Modify from "./Modify";

const Mypage = () => {
  const { userSeq } = useParams();
  const dispatch = useDispatch();
  const { mySeq } = useSelector((state) => state.user.value);
  const [isModify, setIsModify] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // 주석이다

  useEffect(() => {
    dispatch(getMypage(userSeq))
      .unwrap()
      .then((res) => {
        setUserInfo(res);
      });
  }, [dispatch, userSeq]);

  const modifyHandler = (isOpen) => {
    setIsModify(isOpen);
  };

  return (
    <section className="flex">
      <Profile
        isMe={+userSeq === mySeq}
        userInfo={userInfo}
        openModify={modifyHandler}
      />
      {!isModify && <Project />}
      {isModify && <Modify closeModify={modifyHandler} />}
    </section>
  );
};

export default Mypage;
