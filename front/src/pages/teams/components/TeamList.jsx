import React from "react";

import TeamListItem from "./TeamListItem";

const TeamList = ({ teams, clickTeam }) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-full gap-2">
        {teams?.map((team) => (
          <TeamListItem
            key={`team${team.teamSeq}`}
            clickTeam={clickTeam}
            team={team}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamList;
