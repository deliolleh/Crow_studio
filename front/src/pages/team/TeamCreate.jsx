import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { createTeam } from "../../redux/teamSlice";

const initialInputState = { teamName: "", projectName: "", templateName: "" };

const TeamCreate = () => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState(initialInputState);
  const { teamName, projectName, templateName } = inputs;

  //
  const inputChangeHandler = (e) => {
    if (e.target.name === "teamName") {
      setInputs((prev) => {
        return { ...prev, teamName: e.target.value };
      });
    } else if (e.target.name === "projectName") {
      setInputs((prev) => {
        return { ...prev, projectName: e.target.value };
      });
    } else if (e.target.name === "templateName") {
      setInputs((prev) => {
        return { ...prev, templateName: e.target.value };
      });
    }
  };

  //
  const submitHandler = (e) => {
    e.preventDefault();

    const teamNameData = { teamName };

    dispatch(createTeam(JSON.stringify(teamNameData)))
      .unwrap()
      .then((res) => {
        alert("팀 생성 완료");
        console.log("res:", res);
      })
      .catch(console.error);
  };

  return (
    <div>
      <form
        method="post"
        onSubmit={submitHandler}
        className="flex flex-col items-center"
      >
        {/* Team Name */}
        <div className="w-80 mb-1">
          <label htmlFor="teamName" className="">
            팀 이름
          </label>
          <input
            type="teamName"
            id="teamName"
            name="teamName"
            className="mt-1 w-full text-component_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
            placeholder="팀 이름을 입력하세요"
            required
            value={teamName}
            onChange={inputChangeHandler}
          />
          <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
            에러메시지예정
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-80 text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition mb-4"
          onClick={submitHandler}
        >
          팀 생성
        </button>
      </form>
    </div>
  );
};

export default TeamCreate;
