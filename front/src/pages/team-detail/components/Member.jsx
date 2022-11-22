import React from "react";
import { IoClose } from "react-icons/io5";

const Member = (props) => {
  const { isLeader, member, teamLeaderNickname, deleteMember } = props;

  const deleteHandler = () =>
    deleteMember(member.memberNickname, member.memberSeq);

  return (
    <div className="flex flex-col items-center p-2">
      <div className="text-white text-sm flex items-center">
        {isLeader ? teamLeaderNickname : member.memberNickname}
        {!isLeader && (
          <IoClose
            className="cursor-pointer text-point_pink ml-1"
            onClick={deleteHandler}
          />
        )}
      </div>
    </div>
  );
};

export default Member;
