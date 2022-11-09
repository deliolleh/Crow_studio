import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getTeams } from "../../redux/teamSlice";

import Header from "../../components/Header";
import TeamList from "./components/TeamList";

const Teams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myNickname = useSelector((state) => state.user.value.myNickname);

  const [teams, setTeams] = useState(null);

  const createTeamHandler = () => navigate("/teams/create");

  const clickTeamDetailHandler = (teamSeq) => navigate(`/teams/${teamSeq}`);

  useEffect(() => {
    dispatch(getTeams())
      .unwrap()
      .then((res) => setTeams(() => [...res]))
      .catch(console.error);
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div className="p-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
        <div className="flex justify-between">
          <h1 className="text-white text-xl font-bold">팀 목록</h1>
          <button
            className="px-2 py-1 text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow rounded-md transition"
            onClick={createTeamHandler}
          >
            새로운 팀 생성
          </button>
        </div>
        <span className="text-point_light_yellow">{myNickname}</span>
        <TeamList clickTeamDetail={clickTeamDetailHandler} teams={teams} />
      </div>
    </div>
  );
};

export default Teams;
