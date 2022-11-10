import React from "react";

import Member from "./Member";

const TeamListItem = ({ team, clickTeam }) => {
  const {
    teamSeq,
    teamName,
    teamLeaderNickname,
    memberDtoList: members,
  } = team;

  const clickTeamListItemHandler = () => clickTeam(teamSeq);

  return (
    <div
      onClick={clickTeamListItemHandler}
      className="flex items-center gap-2 bg-component_item_bg_dark hover:cursor-pointer rounded-md"
    >
      <div className="w-48 text-white font-bold bg-point_purple h-full p-2 flex items-center rounded-bl-md rounded-tl-md">
        {teamName}
      </div>
      {/* 팀장 */}
      <Member isLeader={true} teamLeaderNickname={teamLeaderNickname} />
      {/* 팀원들 */}
      <div className="flex">
        {members.map((member) => (
          <Member
            key={`member${member.memberSeq}`}
            isLeader={false}
            memberNickname={member.memberNickname}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamListItem;
