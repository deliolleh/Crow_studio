import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  // getTeams,
  // getTeam,
  createTeam,
  // modifyTeamName,
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

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(teamName);
    dispatch(createTeam(JSON.stringify({ teamName: teamName })))
      .unwrap()
      .then(console.log)
      .catch(console.error);
  };

  useEffect(() => {
    // dispatch(getTeams()).unwrap().then(console.log).catch(console.error);
    // dispatch(getTeam(1)).unwrap().then(console.log).catch(console.error);
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div>Team</div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Team;
