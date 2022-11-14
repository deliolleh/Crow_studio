import React, { useState } from "react";

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
    <div className="flex items-center gap-1">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="inputTeamName"
          id="inputTeamName"
          defaultValue={originTeamName}
          onChange={inputTeamNameChangeHandler}
          className="rounded-md bg-component_item_bg_+2_dark px-4 py-1 text-sm font-medium text-white text-left appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
        />
      </form>
      <span onClick={onClose} className="cursor-pointer">
        ❌
      </span>
    </div>
  );
};

export default TeamNameModifyInput;
