import React from "react";
import { IoClose } from "react-icons/io5";

const Member = ({ isLeader, member, teamLeaderNickname, onDelete }) => {
  // const { memberNickname, memberSeq } = member;

  const deleteHandler = () => onDelete(member.memberNickname, member.memberSeq);

  return (
    <div className="flex flex-col items-center p-2">
      {/* <div className="bg-point_light_yellow w-11 h-11 rounded-full"></div> */}
      <div className="text-white text-sm flex items-center">
        {isLeader ? teamLeaderNickname : member.memberNickname}
        {isLeader ? (
          <></>
        ) : (
          // <span className="cursor-pointer" onClick={deleteHandler}>
          //   ❌
          // </span>
          <IoClose className="cursor-pointer text-point_pink ml-2" onClick={deleteHandler} />
        )}
      </div>
    </div>
  );
};

export default Member;
