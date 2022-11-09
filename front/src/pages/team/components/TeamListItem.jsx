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
      <div className="flex">
        {members.map((member) => (
          <div
            key={`m${member.memberSeq}`}
            className="flex flex-col gap-2 items-center"
          >
            <div className="bg-point_light_yellow w-11 h-11 rounded-full"></div>
            <div className="text-white">{member.memberNickname}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamListItem;
