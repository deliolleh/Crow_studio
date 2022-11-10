import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { modifyTeamName, deleteTeam } from "../../../redux/teamSlice";

import TeamName from "./TeamName";
import TeamNameModifyInput from "./TeamNameModifyInput";
import TeamListButton from "./TeamListButton";
import RedButton from "./RedButton";

const TeamDetailHeader = ({ teamName, isLeader, teamSeq, setTeamName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModify, setIsModify] = useState(false);

  const openModifyHandler = () => setIsModify(true);
  const closeModifyHandler = () => setIsModify(false);
  const submitTeamNameModifyHandler = (modifiedTeamName) => {
    dispatch(modifyTeamName({ teamName: modifiedTeamName, teamSeq }))
      .unwrap()
      .then((resTeamName) => {
        setTeamName(resTeamName);
        setIsModify(false);
      })
      .catch(console.error);
  };

  const goTeamListHandler = () => navigate("/teams");

  const deleteTeamHandler = () => {
    if (!window.confirm("정말로 팀을 삭제하시겠습니까?")) {
      return;
    }
    dispatch(deleteTeam(teamSeq))
      .unwrap()
      .then(() => {
        alert("성공적으로 삭제되었습니다");
        navigate("/teams");
      })
      .catch(console.error);
  };

  const resignTeamHandler = () => {
    if (!window.confirm("정말로 팀에서 탈퇴하시겠습니까?")) {
      return;
    }
    alert("가지마");
  };

  return (
    <div className="flex justify-between">
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
