import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTeam,
  modifyTeamName,
  deleteTeam,
  addMember,
  deleteMember,
} from "../../redux/teamSlice";
import { searchUser } from "../../redux/userSlice";

import Header from "../../components/Header";

const TeamDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teamSeq } = useParams();
  const { mySeq, myNickname } = useSelector((state) => state.user.value);

  const [team, setTeam] = useState({});
  const {
    teamName,
    teamLeaderNickname,
    teamLeaderSeq,
    memberDtoList: members,
  } = team;

  const [isEdit, setIsEdit] = useState(false);

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
        setIsEdit(false);
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

  const openTeamNameEditorHandler = () => setIsEdit(true);

  const closeTeamNameEditorHandler = () => setIsEdit(false);

  return (
    <div>
      <Header />
      <div className="p-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
        <div className="flex justify-between">
          {!isEdit && (
            <h1 className="text-white text-xl font-bold">
              {teamName}{" "}
              <span
                className="cursor-pointer"
                onClick={openTeamNameEditorHandler}
              >
                v
              </span>
            </h1>
          )}

          {isEdit && (
            <div className="flex gap-1">
              <form onSubmit={submitTeamNameChange}>
                <input
                  type="text"
                  name="inputTeamName"
                  id="inputTeamName"
                  defaultValue={teamName}
                  onChange={inputTeamNameChangeHandler}
                />
              </form>
              <span
                onClick={closeTeamNameEditorHandler}
                className="cursor-pointer"
              >
                X
              </span>
            </div>
          )}

          {teamLeaderSeq === mySeq && (
            <button className="px-2 py-1 text-lg font-bold text-component_dark bg-point_pink hover:bg-point_red hover:text-white rounded-md transition">
              팀 삭제
            </button>
          )}

          {!(teamLeaderSeq === mySeq) && (
            <button className="px-2 py-1 text-lg font-bold text-component_dark bg-point_pink hover:bg-point_red hover:text-white rounded-md transition">
              팀 탈퇴
            </button>
          )}
        </div>
        <span className="text-point_light_yellow">{myNickname}</span>
        {/* <TeamList clickTeamDetail={clickTeamDetailHandler} teams={teams} /> */}
      </div>

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
