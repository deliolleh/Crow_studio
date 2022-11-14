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
    <div className="md:w-80 sm:w-[600px] w-[400px] h-96 flex justify-center items-center border border-primary_-2_dark rounded-md md:mr-2 md:mb-0 sm:mr-0 sm:mb-2 mb-2">
      <div className="flex flex-col items-center">
        <div className="bg-point_purple w-36 h-36 rounded-full mb-6 mx-3"></div>
        <div className="text-white text-2xl font-bold">{userNickname}</div>
        <div className="text-primary_-2_dark text-sm mb-6">{userEmail}</div>
        {/* <div className="text-sm mb-6">상태 메시지</div> */}
        {+userSeq === mySeq && (
          <button
            onClick={openModifyHandler}
            className="sm:w-[169px] w-auto h-[36px] p-2 text-sm font-bold text-primary_dark hover:text-black bg-component_item_bg_dark border hover:bg-point_light_yellow border-primary_-2_dark hover:border-white rounded-md"
          >
            내 정보 수정하기
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
