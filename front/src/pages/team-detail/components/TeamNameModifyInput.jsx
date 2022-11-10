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
    <div className="flex gap-1">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="inputTeamName"
          id="inputTeamName"
          defaultValue={originTeamName}
          onChange={inputTeamNameChangeHandler}
        />
      </form>
      <span onClick={onClose} className="cursor-pointer">
        ❌
      </span>
    </div>
  );
};

export default TeamNameModifyInput;
