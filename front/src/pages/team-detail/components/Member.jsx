import React from "react";

const Member = ({ isLeader, member, teamLeaderNickname, onDelete }) => {
  // const { memberNickname, memberSeq } = member;

  const deleteHandler = () => onDelete(member.memberNickname, member.memberSeq);

  return (
    <div className="flex flex-col gap-2 items-center p-2">
      {/* <div className="bg-point_light_yellow w-11 h-11 rounded-full"></div> */}
      <div className="text-white text-sm">
        {isLeader ? teamLeaderNickname : member.memberNickname}
        {isLeader ? (
          <></>
        ) : (
          <span className="cursor-pointer" onClick={deleteHandler}>
            ❌
          </span>
        )}
      </div>
    </div>
  );
};

export default Member;
