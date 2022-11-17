import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import userApi from "../../api/userApi";

const Profile = ({ userSeq }) => {
  const { mySeq, myNickname } = useSelector((state) => state.user.value);
  const [userInfo, setUserInfo] = useState({});
  const { userNickname, userEmail } = userInfo;

  useEffect(() => {
    userApi
      .getMypage(userSeq)
      .then((res) => setUserInfo(res.data))
      .catch(console.error);
  }, [userSeq, myNickname]);

  return (
    <div className="md:w-80 sm:w-[600px] w-[400px] md:h-96 h-80 flex justify-center items-center border border-primary_-2_dark rounded-md md:mr-2 md:mb-0 sm:mr-0 sm:mb-2 mb-2 py-4">
      <div className="flex flex-col items-center">
        {/* 프사 기본 */}
        <img
          className="w-36 h-36 mb-6 mx-3 rounded-full cursor-pointer"
          src={require("../../assets/images/elmo.jpg")}
          alt="profile-img"
        />

        {/* 닉네임 */}
        <div className="text-white text-2xl font-bold">{userNickname}</div>

        {/* 메일 */}
        <div className="text-primary_-2_dark text-sm mb-6">{userEmail}</div>
        {/* <div className="text-sm mb-6">상태 메시지</div> */}

        {/* 정보 수정 버튼 */}
        {+userSeq === mySeq && (
          <button className="sm:w-[169px] w-auto h-[36px] p-2 text-sm font-bold text-primary_dark hover:text-black bg-component_item_bg_dark border hover:bg-point_light_yellow border-primary_-2_dark hover:border-white rounded-md">
            내 정보 수정하기
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
