import React from "react";
import { BsPencilFill } from "react-icons/bs";

const TeamName = (props) => {
  const { children, openTeamNameUpdate, isLeader } = props;

  return (
    <h1 className="text-white text-xl font-bold flex items-center">
      {children}
      {isLeader && (
        <BsPencilFill
          className="ml-3 mr-5 text-sm text-point_yellow_+2 cursor-pointer hover:text-point_yellow hover:scale-125 transition"
          onClick={openTeamNameUpdate}
        />
      )}
    </h1>
  );
};

export default TeamName;
