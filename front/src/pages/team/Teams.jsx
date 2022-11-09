import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getTeams } from "../../redux/teamSlice";

import Header from "../../components/Header";
import TeamListItem from "./components/TeamListItem";

const Teams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [teams, setTeams] = useState(null);

  const createTeamHandler = () => navigate("/teams/create");

  const clickTeamDetailHandler = (teamSeq) => navigate(`/teams/${teamSeq}`);

  useEffect(() => {
    dispatch(getTeams())
      .unwrap()
      .then((res) => {
        console.log("res:", res);
        setTeams(() => [...res]);
      })
      .catch(console.error);
  }, [dispatch]);

  return (
    <div>
      <Header />
      <h1 className="text-2xl">팀 목록</h1>
      <div className="flex flex-col gap-2">
        {teams?.map((team) => (
          <TeamListItem
            key={`team${team.teamSeq}`}
            clickTeamDetail={clickTeamDetailHandler}
            team={team}
          />
        ))}
      </div>

      <div className="w-fit h-96 px-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
        <div className="text-white text-xl font-bold">나의 프로젝트</div>
        <div className="text-point_light_yellow">금오</div>
        <div className="flex">
          <div className="w-32 h-56 pr-3 flex flex-col justify-around items-end bg-point_purple rounded-tl-2xl rounded-bl-2xl">
            <div className="text-white font-bold">팀장</div>
            <div className="text-white font-bold">팀원</div>
            <div className="text-white font-bold">프로젝트</div>
          </div>
          <div className="w-96 h-56 pl-5 flex flex-col justify-around items-start bg-component_item_bg_dark rounded-tr-2xl rounded-br-2xl">
            <div className="flex">
              {/* <Member /> */}
              멤버
            </div>
            <div className="flex">
              {/* <Member /> */}
              {/* <Member /> */}
              {/* <Member /> */}
              {/* <Member /> */}
              {/* <Member /> */}
              멤버
            </div>
            <div className="text-point_light_yellow">/까마귀공방</div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-80 text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition mb-4"
        onClick={createTeamHandler}
      >
        새로운 팀 생성
      </button>
    </div>
  );
};

export default Teams;
