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

  const [isModify, setIsModify] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const [modifiedTeamName, setModifiedTeamName] = useState(teamName);

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

  const goTeamListHandler = () => navigate("/teams");

  const inputTeamNameChangeHandler = (e) => setModifiedTeamName(e.target.value);

  const submitTeamNameModifyHandler = (e) => {
    e.preventDefault();
    dispatch(modifyTeamName({ teamName: modifiedTeamName, teamSeq }))
      .unwrap()
      .then((res) => {
        setTeam((prev) => {
          return { ...prev, teamName: res };
        });
        setIsModify(false);
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

  const submitSearchUserHandler = (e) => {
    e.preventDefault();
    const searchData = JSON.stringify({ searchWord: searchUserName });
    dispatch(searchUser(searchData))
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
        console.log(res);
        setIsSearch(false);
        setSearchResults([]);
        dispatch(getTeam(teamSeq))
          .unwrap()
          .then((res) => setTeam(res))
          .catch(console.error);
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
      .then(() => {
        dispatch(getTeam(teamSeq))
          .unwrap()
          .then((res) => setTeam(res))
          .catch(console.error);
      })
      .catch((errorStatusCode) => {
        console.error(errorStatusCode);
      });
  };

  const openTeamNameEditorHandler = () => setIsModify(true);

  const closeTeamNameEditorHandler = () => setIsModify(false);

  const openSearchInputHandler = () => setIsSearch(true);

  const closeSearchInputHandler = () => setIsSearch(false);

  return (
    <div>
      <Header />
      <div className="p-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
        {/* 팀 이름, 팀 이름 변경, 팀 목록 버튼, 팀 삭제 버튼, 팀 탈퇴 버튼 */}
        <div className="flex justify-between">
          {/* isModify가 아니면 팀 이름, isModify이면 팀 이름 변경 input 나옴 */}
          {!isModify ? (
            <h1 className="text-white text-xl font-bold">
              {teamName}{" "}
              <span
                className="text-sm cursor-pointer"
                onClick={openTeamNameEditorHandler}
              >
                ✏
              </span>
            </h1>
          ) : (
            <div className="flex gap-1">
              <form onSubmit={submitTeamNameModifyHandler}>
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
                ❌
              </span>
            </div>
          )}

          {/* 팀 목록, 팀 삭제(팀 탈퇴) 버튼 컨테이너 */}
          <div className="flex gap-2">
            {/* 팀 목록 버튼 */}
            <button
              onClick={goTeamListHandler}
              className="px-2 py-1 text-lg text-primary_dark bg-component_item_bg_dark border border-primary_-2_dark rounded-md"
            >
              팀 목록
            </button>
            {/* 팀장이면 팀 삭제 버튼, 팀원이면 팀 탈퇴 버튼 */}
            {teamLeaderSeq === mySeq ? (
              <button
                onClick={deleteTeamHandler}
                className="px-2 py-1 text-lg font-bold text-component_dark bg-point_pink hover:bg-point_red hover:text-white rounded-md transition"
              >
                팀 삭제
              </button>
            ) : (
              <button className="px-2 py-1 text-lg font-bold text-component_dark bg-point_pink hover:bg-point_red hover:text-white rounded-md transition">
                팀 탈퇴
              </button>
            )}
          </div>
        </div>

        {/* 현재 로그인한 유저 닉네임 */}
        <span className="text-point_light_yellow">{myNickname}</span>

        {/* 팀장 */}
        <div className="flex items-center">
          <div className="w-48 text-white font-bold bg-point_purple h-full p-2 flex items-center rounded-bl-md rounded-tl-md">
            팀장
          </div>
          <div className="flex">
            <div className="flex flex-col gap-2 items-center p-2">
              {/* <div className="bg-point_light_yellow w-11 h-11 rounded-full"></div> */}
              <div className="text-white text-sm">{teamLeaderNickname}</div>
            </div>
          </div>
        </div>

        {/* 팀원 */}
        <div className="flex items-center">
          <div className="w-48 text-white font-bold bg-point_purple h-full p-2 flex items-center rounded-bl-md rounded-tl-md">
            팀원
          </div>
          <div className="flex">
            {members?.map((member) => (
              <div
                key={`m${member.memberSeq}`}
                className="flex flex-col gap-2 items-center p-2"
              >
                {/* <div className="bg-point_light_yellow w-11 h-11 rounded-full"></div> */}
                <div className="text-white text-sm">
                  {member.memberNickname}{" "}
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      deleteMemberHandler(
                        member.memberNickname,
                        member.memberSeq
                      )
                    }
                  >
                    ❌
                  </span>
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-2 items-center p-2">
              {/* <div className="bg-point_light_yellow w-11 h-11 rounded-full"></div> */}

              {/* isSearch가 아니면 + 버튼, isSearch이면 유저 검색 입력창 나옴 */}
              {!isSearch ? (
                <div
                  className="text-white text-sm cursor-pointer"
                  onClick={openSearchInputHandler}
                >
                  ➕
                </div>
              ) : (
                <div className="flex gap-1">
                  <div>유저검색</div>
                  <form onSubmit={submitSearchUserHandler}>
                    <input
                      type="text"
                      name="searchUser"
                      id="searchUser"
                      onChange={searchUserChangeHandler}
                      value={searchUserName}
                    />
                  </form>
                  <span
                    onClick={closeSearchInputHandler}
                    className="cursor-pointer"
                  >
                    ❌
                  </span>

                  <div>
                    {searchResults?.map((user) => (
                      <div
                        key={user.userId}
                        className="hover:cursor-pointer"
                        onClick={() =>
                          addUserHandler(user.userSeq, user.userNickname)
                        }
                      >
                        {user.userNickname}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 프로젝트 경로 */}
        <div className="flex items-center">
          <div className="w-48 text-white font-bold bg-point_purple h-full p-2 flex items-center rounded-bl-md rounded-tl-md">
            프로젝트
          </div>
          <div className="flex">
            <div className="text-white text-sm p-2">/까마귀공방</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
