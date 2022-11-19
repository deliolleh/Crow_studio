import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import teamApi from "../../api/teamApi";

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
    teamApi
      .getTeams()
      .then((res) => setMyTeams(res.data))
      .catch(console.error);
  }, [dispatch]);

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <div className="m-3 mb-6 flex h-screen items-center justify-center overflow-auto">
        <div className="px-8 py-8 lg:w-4/5 w-fit max-w-[1000px] h-fit flex flex-col justify-center border border-primary_-2_dark rounded-md">
          {/* 타이틀 */}
          <div className="flex justify-between items-center md:mb-5 mb-2">
            <div className="flex items-center">
              {/* 현재 로그인한 유저 닉네임 */}
              <span className="md:text-xl text-sm font-bold text-point_light_yellow md:mr-2 mr-1">
                {myNickname}
              </span>
              {/* 제목 */}
              <span className="text-white text-sm md:font-bold">
                님의 팀 목록 ({myTeams.length})
              </span>
            </div>
            {/* 팀 생성 버튼 */}
            <button
              className="md:px-3 ml-4 px-2 py-1 md:text-sm text-[13px] font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow rounded-md transition"
              onClick={createTeamHandler}
            >
              새로운 팀 생성
            </button>
          </div>

          {/* 팀 리스트 */}
          {myTeams.length > 0 ? (
            <TeamList clickTeam={clickTeamHandler} teams={myTeams} />
          ) : (
            <div className="mt-4">팀이 없습니다</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams;
