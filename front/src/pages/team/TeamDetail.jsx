import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTeam,
  modifyTeamName,
  deleteTeam,
  addMember,
  deleteMember,
} from "../../redux/teamSlice";
import { searchUser } from "../../redux/userSlice";

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
      .then((res) => {
        setSearchResults(res);
        console.log("res:", res);
      })
      .catch(console.error);
  };

  const addUserHandler = (addUserSeq, addUserName) => {
    console.log("addUserSeq:", addUserSeq);
    if (!window.confirm(`${addUserName}님을 팀원으로 추가할까요?`)) {
      return;
    }
    const addMemberData = JSON.stringify({ teamSeq, memberSeq: addUserSeq });
    dispatch(addMember(addMemberData))
      .unwrap()
      .then((res) => {
        alert(`${addUserName}님을 팀원으로 추가했습니다`);
        console.log(res);
      })
      .catch((errorStatusCode) => {
        if (errorStatusCode === 409) {
          alert("이미 추가된 팀원입니다");
        } else {
          alert("비상!!");
        }
      });
  };

  const deleteMemberHandler = (memberNickname, memberSeq) => {
    if (!window.confirm(`${memberNickname}님을 팀에서 삭제하시겠습니까?`)) {
      return;
    }
    const deleteData = JSON.stringify({ teamSeq, memberSeq });
    console.log("deleteData:", deleteData);
    dispatch(deleteMember(deleteData))
      .unwrap()
      .then(console.log)
      .catch((errorStatusCode) => {
        console.error(errorStatusCode);
      });
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
            <div>
              {member.memberNickname}{" "}
              <span
                onClick={() =>
                  deleteMemberHandler(member.memberNickname, member.memberSeq)
                }
                className="cursor-pointer"
              >
                X
              </span>
            </div>
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
      <div>
        {searchResults?.map((user) => (
          <div
            key={user.userId}
            className="hover:cursor-pointer"
            onClick={() => addUserHandler(user.userSeq, user.userNickname)}
          >
            {user.userNickname}
          </div>
        ))}
      </div>

      <br />

      <button onClick={deleteTeamHandler}>팀 삭제</button>

      <br />

      <button onClick={clickTeamListHandler}>팀 목록</button>
    </div>
  );
};

export default TeamDetail;
