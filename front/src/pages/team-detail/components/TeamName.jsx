import React from "react";
import { BsPencilFill } from "react-icons/bs";

const TeamName = ({ children, onOpenModify }) => {
  return (
    <h1 className="text-white text-xl font-bold flex items-center">
      {children}
      {/* <span className="ml-2 text-sm cursor-pointer" onClick={onOpenModify}>
        {" "}
        ✏
      </span> */}
      <BsPencilFill className="ml-3 text-sm text-point_yellow_+2 cursor-pointer" onClick={onOpenModify} />
    </h1>
  );
};

export default TeamName;
