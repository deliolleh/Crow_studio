import React from "react";

const TeamListItem = ({ team, clickTeamDetail }) => {
  const {
    teamSeq,
    teamName,
    teamLeaderNickname,
    memberDtoList: members,
  } = team;

  const clickHandler = () => clickTeamDetail(teamSeq);

  return (
    <div onClick={clickHandler} className="flex hover:cursor-pointer">
      <div>🙄</div>
      <div>{teamSeq}</div>
      <div>{teamName}</div>
      <div>{teamLeaderNickname}</div>
      <div>
        {members.map((member) => (
          <div key={`m${member.memberSeq}`}>{member.memberNickname}</div>
        ))}
      </div>
    </div>
  );
};

export default TeamListItem;
