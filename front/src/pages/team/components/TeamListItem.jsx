import React from "react";

const TeamListItem = ({ team, clickTeamDetail }) => {
  const {
    teamSeq,
    teamName,
    teamLeaderNickname,
    memberDtoList: members,
    teamLeaderSeq,
  } = team;

  const clickHandler = () => clickTeamDetail(teamSeq);

  return (
    <div
      onClick={clickHandler}
      className="flex items-center gap-2 bg-component_item_bg_dark hover:cursor-pointer"
    >
      {/* <div className="text-white bg-point_purple p-1">{teamSeq}</div> */}
      <div className="text-white bg-point_purple h-full p-2 flex items-center">
        {teamName}
      </div>
      <div>
        <div
          key={`l${teamLeaderSeq}`}
          className="flex flex-col gap-2 items-center"
        >
          <div className="bg-point_light_yellow w-11 h-11 rounded-full"></div>
          <div className="text-white">{teamLeaderNickname}</div>
        </div>
      </div>
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
