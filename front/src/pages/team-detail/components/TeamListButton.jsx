import React from "react";

const TeamListButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 text-lg text-primary_dark bg-component_item_bg_dark border border-primary_-2_dark hover:bg-component_item_bg_+2_dark hover:text-white rounded-md transition"
    >
      {children}
    </button>
  );
};

export default TeamListButton;
