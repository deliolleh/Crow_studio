import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getTeams } from "../../redux/teamSlice";

import Header from "../../components/Header";
import TeamList from "./components/TeamList";

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
      <div className="p-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
        <div className="text-white text-xl font-bold">팀 목록</div>
        <div className="text-point_light_yellow">나의 닉네임</div>
        <TeamList clickTeamDetail={clickTeamDetailHandler} teams={teams} />
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
