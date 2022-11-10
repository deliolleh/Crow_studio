import React from "react";

const TeamName = ({ children, onOpenModify }) => {
  return (
    <h1 className="text-white text-xl font-bold">
      {children}
      <span className="text-sm cursor-pointer" onClick={onOpenModify}>
        {" "}
        ✏
      </span>
    </h1>
  );
};

export default TeamName;
