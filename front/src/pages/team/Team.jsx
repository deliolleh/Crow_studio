import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  getTeams,
  getTeam,
  createTeam,
  modifyTeamName,
  deleteTeam,
  // deleteTeam,
  // getMembers,
  // addMember,
  // deleteMember,
  // delegateLeader,
  // resignTeam,
} from "../../redux/teamSlice";

import Header from "../../components/Header";

const Team = () => {
  const dispatch = useDispatch();

  const [teamName, setTeamName] = useState("");
  const [modifiedTeamName, setModifiedTeamName] = useState("");

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

  useEffect(() => {
    dispatch(getTeams()).unwrap().then(console.log).catch(console.error);
    // dispatch(getTeam(6)).unwrap().then(console.log).catch(console.error);
    // dispatch(deleteTeam(7)).unwrap().then(console.log).catch(console.error);
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div>Team</div>
      <form onSubmit={submitHandler1}>
        <label>팀 생성</label>
        <input
          type="text"
          name="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </form>

      <br />

      <form onSubmit={submitHandler2}>
        <label>팀명 수정</label>
        <input
          type="text"
          name="teamNameModify"
          value={modifiedTeamName}
          onChange={(e) => setModifiedTeamName(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Team;
