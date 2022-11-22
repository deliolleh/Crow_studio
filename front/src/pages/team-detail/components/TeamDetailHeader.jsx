import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import teamApi from "../../../api/teamApi";

import TeamName from "./TeamName";
import TeamNameUpdateInput from "./TeamNameUpdateInput";
import TeamListButton from "./TeamListButton";
import RedButton from "./RedButton";

const TeamDetailHeader = (props) => {
  const { teamName, isLeader, teamSeq, setTeamName } = props;
  const navigate = useNavigate();
  const [showTeamNameUpdate, setShowTeamNameUpdate] = useState(false);

  const openTeamNameUpdateHandler = () => setShowTeamNameUpdate(true);
  const closeTeamNameUpdateHandler = () => setShowTeamNameUpdate(false);

  const submitTeamNameUpdateHandler = async (updatedTeamName) => {
    try {
      const teamNameData = { teamName: updatedTeamName };
      await teamApi.updateTeamName(teamSeq, teamNameData);
      setTeamName(updatedTeamName);
      setShowTeamNameUpdate(false);
    } catch (err) {
      console.error(err);
      const errStatusCode = err.response.status;
      if (errStatusCode === 409) {
        alert("이미 같은 팀 이름이 존재합니다");
      } else {
        alert("비상!!");
      }
    }
  };

  const goTeamListHandler = () => navigate("/teams");

  const deleteTeamHandler = async () => {
    if (!window.confirm("정말로 팀을 삭제하시겠습니까?")) {
      return;
    }
    try {
      await teamApi.deleteTeam(teamSeq);
      navigate("/teams");
    } catch (err) {
      console.error(err);
    }
  };

  const resignTeamHandler = async () => {
    if (!window.confirm("정말로 팀에서 탈퇴하시겠습니까?")) {
      return;
    }
    alert("가지마");
  };

  return (
    <div className="flex justify-between items-center w-full mb-5">
      {!showTeamNameUpdate ? (
        <TeamName openTeamNameUpdate={openTeamNameUpdateHandler}>
          {teamName}
        </TeamName>
      ) : (
        <TeamNameUpdateInput
          initialTeamName={teamName}
          submitTeamNameUpdate={submitTeamNameUpdateHandler}
          closeTeamNameUpdate={closeTeamNameUpdateHandler}
        />
      )}
      {/* 팀 목록 버튼, 팀 삭제(팀 탈퇴) 버튼 컨테이너 */}
      <div className="flex gap-2">
        <TeamListButton onClick={goTeamListHandler}>팀 목록</TeamListButton>
        <RedButton onClick={isLeader ? deleteTeamHandler : resignTeamHandler}>
          {isLeader ? "팀 삭제" : "팀 탈퇴"}
        </RedButton>
      </div>
    </div>
  );
};

export default TeamDetailHeader;
