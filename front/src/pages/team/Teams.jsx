import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getTeams,
  getTeam,
  createTeam,
  modifyTeamName,
  deleteTeam,
  getMembers,
  addMember,
  // deleteMember,
  // delegateLeader,
  // resignTeam,
} from "../../redux/teamSlice";

import Header from "../../components/Header";

const Teams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [modifiedTeamName, setModifiedTeamName] = useState("");

  const [teams, setTeams] = useState(null);

  const submitHandler1 = (e) => {
    e.preventDefault();
    console.log(teamName);
    dispatch(createTeam(JSON.stringify({ teamName })))
      .unwrap()
      .then(console.log)
      .catch(console.error);
  };

  const submitHandler2 = (e) => {
    e.preventDefault();
    dispatch(modifyTeamName({ teamSeq: 6, teamName: modifiedTeamName }))
      .unwrap()
      .then(console.log)
      .catch(console.error);
  };

  const createTeamHandler = () => {
    console.log("createTeam");
    navigate("/teams/create");
  };

  const clickTeamHandler = (teamSeq) => {
    navigate(`/teams/${teamSeq}`);
  };

  useEffect(() => {
    dispatch(getTeams())
      .unwrap()
      .then((res) => {
        console.log("res:", res);
        setTeams(() => [...res]);
      })
      .catch(console.error);
    // dispatch(getTeam(6)).unwrap().then(console.log).catch(console.error);
    // dispatch(deleteTeam(7)).unwrap().then(console.log).catch(console.error);
    // dispatch(getMembers(3)).unwrap().then(console.log).catch(console.error);
    // dispatch(addMember(JSON.stringify({ teamSeq: 3, memberSeq: 4 })))
    //   .unwrap()
    //   .then(console.log)
    //   .catch(console.error);
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div>Team</div>
      {/* <form onSubmit={submitHandler1}>
        <label>팀 생성</label>
        <input
          type="text"
          name="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </form> */}

      <div>
        {teams?.map((team) => (
          <div
            key={`t${team.teamSeq}`}
            className="flex gap-2 hover:cursor-pointer"
            onClick={() => clickTeamHandler(team.teamSeq)}
          >
            <div>🙄</div>
            <div>{team.teamSeq}</div>
            <div>{team.teamName}</div>
            <div>{team.teamLeaderNickname}</div>
            <div>
              {team.memberDtoList.map((member) => (
                <div key={`m${member.memberSeq}`}>{member.memberNickname}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={createTeamHandler}>팀 생성하기</button>

      <br />

      {/* <form onSubmit={submitHandler2}>
        <label>팀명 수정</label>
        <input
          type="text"
          name="teamNameModify"
          value={modifiedTeamName}
          onChange={(e) => setModifiedTeamName(e.target.value)}
        />
      </form> */}
    </div>
  );
};

export default Teams;
