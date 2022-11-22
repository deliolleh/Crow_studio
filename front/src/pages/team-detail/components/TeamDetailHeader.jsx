import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import teamApi from "../../../api/teamApi";

import TeamName from "./TeamName";
import TeamNameModifyInput from "./TeamNameModifyInput";
import TeamListButton from "./TeamListButton";
import RedButton from "./RedButton";

const TeamDetailHeader = (props) => {
  const { teamName, isLeader, teamSeq, setTeamName } = props;
  const navigate = useNavigate();
  const [isModify, setIsModify] = useState(false);

  const openModifyHandler = () => setIsModify(true);
  const closeModifyHandler = () => setIsModify(false);

  const submitTeamNameModifyHandler = async (modifiedTeamName) => {
    try {
      const res = await teamApi.modifyTeamName(teamSeq, modifiedTeamName);
      console.log("res:", res);
      setTeamName(res);
      setIsModify(false);
    } catch (err) {
      console.error(err);
    }
  };

  const goTeamListHandler = () => navigate("/teams");

  const deleteTeamHandler = async () => {
    if (!window.confirm("정말로 팀을 삭제하시겠습니까?")) {
      return;
    }
    try {
      await teamApi.deleteTeam(teamSeq);
      alert("팀이 성공적으로 삭제되었습니다");
      navigate("/teams");
    } catch (err) {
      console.error(err);
    }
  };

  const resignTeamHandler = () => {
    if (!window.confirm("정말로 팀에서 탈퇴하시겠습니까?")) {
      return;
    }
    alert("가지마");
  };

  return (
    <div className="flex justify-between items-center w-full mb-5">
      {/* isModify가 아니면 팀 이름, isModify이면 팀 이름 변경 input 나옴 */}
      {!isModify ? (
        <TeamName onOpenModify={openModifyHandler}>{teamName}</TeamName>
      ) : (
        <TeamNameModifyInput
          originTeamName={teamName}
          onSubmitModify={submitTeamNameModifyHandler}
          onCloseModify={closeModifyHandler}
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
