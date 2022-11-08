import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMypage } from "../../redux/userSlice";

const Profile = ({ openModify, userSeq }) => {
  const dispatch = useDispatch();
  const { mySeq, myNickname } = useSelector((state) => state.user.value);
  const [userInfo, setUserInfo] = useState({});
  const { userNickname, userEmail } = userInfo;
  const openModifyHandler = () => openModify(true);

  useEffect(() => {
    dispatch(getMypage(userSeq))
      .unwrap()
      .then((res) => setUserInfo(res))
      .catch(console.error);
  }, [dispatch, userSeq, myNickname]);

  return (
    <div className="w-80 h-96 flex justify-center items-center border border-primary_-2_dark rounded-md mr-2">
      <div className="flex flex-col items-center">
        <div className="bg-point_purple w-36 h-36 rounded-full mb-6"></div>
        <div className="text-white text-2xl font-bold">{userNickname}</div>
        <div className="text-primary_-2_dark text-sm mb-6">{userEmail}</div>
        <div className="text-sm mb-6">상태 메시지</div>
        {+userSeq === mySeq && (
          <button
            onClick={openModifyHandler}
            className="px-10 py-2 text-primary_dark bg-component_item_bg_dark border border-primary_-2_dark rounded-md"
          >
            내 정보 수정하기
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
