import React from "react";

import TeamListItem from "./TeamListItem";

const TeamList = ({ teams, clickTeamDetail }) => {
  return (
    <div className="flex">
      {/* <div className="flex flex-col justify-around items-end bg-point_purple rounded-tl-2xl rounded-bl-2xl">
        <div className="flex text-white font-bold">
          <div>팀장</div>
          <div>팀원</div>
        </div>
        <div className="text-white font-bold">팀원</div>
        <div className="text-white font-bold">프로젝트</div>
      </div> */}
      <div className="flex flex-col gap-2">
        {teams?.map((team) => (
          <TeamListItem
            key={`team${team.teamSeq}`}
            clickTeamDetail={clickTeamDetail}
            team={team}
          />
        ))}
      </div>
      {/* <div className="w-96 h-56 pl-5 flex flex-col justify-around items-start bg-component_item_bg_dark rounded-tr-2xl rounded-br-2xl">
    <div className="flex">멤버</div>
    <div className="flex">멤버 멤버 멤버 멤버 멤버</div>
    <div className="text-point_light_yellow">/까마귀공방</div>
  </div> */}
    </div>
  );
};

export default TeamList;
