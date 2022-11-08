import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getTeam, modifyTeamName, deleteTeam } from "../../redux/teamSlice";
import { searchUser } from "../../redux/userSlice";

// const initialInputState = { teamName: "", projectName: "", templateName: "" };
// const initialErrorState = {
//   teamNameErrMsg: "",
//   projectNameErrMsg: "",
//   templateNameErrMsg: "",
// };

const TeamDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teamSeq } = useParams();

  const [team, setTeam] = useState({});
  const { teamName, teamLeaderNickname, memberDtoList: members } = team;
  const [inputTeamName, setInputTeamName] = useState(teamName);

  const [searchUserName, setSearchUserName] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    dispatch(getTeam(teamSeq))
      .unwrap()
      .then((res) => {
        setTeam(res);
        console.log("res:", res);
      })
      .catch(console.error);
  }, [dispatch, teamSeq]);

  const clickTeamListHandler = () => navigate("/teams");

  //
  const inputTeamNameChangeHandler = (e) => setInputTeamName(e.target.value);

  const submitTeamNameChange = (e) => {
    e.preventDefault();
    console.log("inputTeamName:", inputTeamName);
    dispatch(modifyTeamName({ teamName: inputTeamName, teamSeq }))
      .unwrap()
      .then((res) => {
        alert("팀 이름 변경 완료");
        setTeam((prev) => {
          return { ...prev, teamName: res };
        });
      })
      .catch(console.error);
  };

  const deleteTeamHandler = () => {
    if (!window.confirm("정말로 팀을 삭제하시겠습니까?")) {
      return;
    }
    dispatch(deleteTeam(teamSeq))
      .unwrap()
      .then(() => {
        alert("성공적으로 삭제되었습니다");
        navigate("/teams");
      })
      .catch(console.error);
  };

  useEffect(() => {}, [teamName]);

  const searchUserChangeHandler = (e) => setSearchUserName(e.target.value);

  const submitSearchUser = (e) => {
    e.preventDefault();
    dispatch(searchUser(JSON.stringify({ searchWord: searchUserName })))
      .unwrap()
      .then((res) => setSearchResults(res))
      .catch(console.error);
  };

  return (
    <div>
      <div>Team Detail</div>
      <div>팀 번호: {teamSeq}</div>
      <div>팀: {teamName}</div>
      <form onSubmit={submitTeamNameChange}>
        <input
          type="text"
          name="inputTeamName"
          id="inputTeamName"
          defaultValue={teamName}
          onChange={inputTeamNameChangeHandler}
        />
      </form>
      <div>팀장: {teamLeaderNickname}</div>
      <div>
        팀원:
        {members?.map((member) => (
          <div key={member.memberSeq}>
            <div>{member.memberNickname}</div>
          </div>
        ))}
      </div>

      <br />

      <div>유저 검색</div>
      <div>
        <form onSubmit={submitSearchUser}>
          <input
            type="text"
            name="searchUser"
            id="searchUser"
            onChange={searchUserChangeHandler}
            value={searchUserName}
          />
        </form>
      </div>

      <div>검색 결과</div>
      <div></div>

      <br />

      <button onClick={deleteTeamHandler}>팀 삭제</button>

      <br />

      <button onClick={clickTeamListHandler}>팀 목록</button>
    </div>
  );
};

export default TeamDetail;
