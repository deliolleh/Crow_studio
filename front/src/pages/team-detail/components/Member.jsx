import React from "react";
import { IoClose } from "react-icons/io5";

const Member = (props) => {
  const { isLeader, member, teamLeaderNickname, onDelete } = props;

  const deleteHandler = () => onDelete(member.memberNickname, member.memberSeq);

  return (
    <div className="flex flex-col items-center p-2">
      <div className="text-white text-sm flex items-center">
        {isLeader ? teamLeaderNickname : member.memberNickname}
        {!isLeader && (
          <IoClose
            className="cursor-pointer text-point_pink ml-2"
            onClick={deleteHandler}
          />
        )}
      </div>
    </div>
  );
};

export default Member;
