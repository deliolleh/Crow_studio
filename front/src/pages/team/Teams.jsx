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
  const [myTeams, setMyTeams] = useState([]);

  const createTeamHandler = () => navigate("/teams/create");
  const clickTeamHandler = (teamSeq) => navigate(`/teams/${teamSeq}`);

  useEffect(() => {
    // 본인이 속한 팀들 가져옴
    dispatch(getTeams())
      .unwrap()
      .then((res) => setMyTeams(res))
      .catch(console.error);
  }, [dispatch]);

  return (
    <div>
      <Header />

      <div className="p-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
        <div className="flex justify-between">
          {/* 제목 */}
          <h1 className="text-white text-xl font-bold">
            팀 목록 ({myTeams.length})
          </h1>
          {/* 팀 생성 버튼 */}
          <button
            className="px-2 py-1 text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow rounded-md transition"
            onClick={createTeamHandler}
          >
            새로운 팀 생성
          </button>
        </div>
        {/* 현재 로그인한 유저 닉네임 */}
        <span className="text-point_light_yellow">{myNickname}</span>
        {/* 팀 리스트 */}
        {myTeams.length > 0 ? (
          <TeamList clickTeam={clickTeamHandler} teams={myTeams} />
        ) : (
          <div>팀이 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default Teams;
