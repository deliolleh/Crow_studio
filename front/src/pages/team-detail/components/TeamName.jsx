import React from "react";
import { BsPencilFill } from "react-icons/bs";

const TeamName = ({ children, onOpenModify }) => {
  return (
    <h1 className="text-white text-xl font-bold flex items-center">
      {children}
      <BsPencilFill
        className="ml-3 mr-5 text-sm text-point_yellow_+2 cursor-pointer"
        onClick={onOpenModify}
      />
    </h1>
  );
};

export default TeamName;
