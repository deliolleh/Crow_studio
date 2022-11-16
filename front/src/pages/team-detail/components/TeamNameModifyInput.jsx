import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const TeamNameModifyInput = (props) => {
  const { originTeamName, onSubmitModify, closeModify } = props;
  const [modifiedTeamName, setModifiedTeamName] = useState(originTeamName);

  const inputTeamNameChangeHandler = (e) => setModifiedTeamName(e.target.value);
  const submitHandler = (e) => {
    e.preventDefault();
    onSubmitModify(modifiedTeamName);
  };
  const onClose = () => closeModify();

  return (
    <div className="flex items-center mr-2">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="inputTeamName"
          id="inputTeamName"
          defaultValue={originTeamName}
          onChange={inputTeamNameChangeHandler}
          className="rounded-md bg-component_item_bg_+2_dark md:w-auto w-[140px] mr-1 px-4 py-1 text-sm font-medium text-white text-left appearance-none shadow-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
        />
      </form>
      <IoClose
        onClick={onClose}
        className="cursor-pointer text-point_pink"
      />
    </div>
  );
};

export default TeamNameModifyInput;
