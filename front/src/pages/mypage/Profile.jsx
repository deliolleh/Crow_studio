import React from "react";

const Profile = ({ openModify, userInfo, isMe }) => {
  const { userId: userEmail, userNickname } = userInfo;
  const clickModifyOpen = () => openModify(true);

  return (
    <div className="w-80 h-96 flex justify-center items-center border border-primary_-2_dark rounded-md mr-2">
      <div className="flex flex-col items-center">
        <div className="bg-point_purple w-36 h-36 rounded-full mb-6"></div>
        <div className="text-white text-2xl font-bold">{userNickname}</div>
        <div className="text-primary_-2_dark text-sm mb-6">{userEmail}</div>
        <div className="text-sm mb-6">상태 메시지</div>
        {isMe && (
          <button
            onClick={clickModifyOpen}
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
