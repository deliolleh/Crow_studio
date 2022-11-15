import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getTeam, addMember, deleteMember } from "../../redux/teamSlice";
import { searchUser } from "../../redux/userSlice";

import Header from "../../components/Header";
import TeamDetailHeader from "./components/TeamDetailHeader";

import Member from "./components/Member";

import Modal from "react-modal";

import { IoAdd } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "auto",
    height: "auto",
    marginRight: "-50%",
    borderRadius: "10px",
    backgroundColor: "#3C3C3C",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const TeamDetail = () => {
  const dispatch = useDispatch();

  const { teamSeq } = useParams();
  const { mySeq, myNickname } = useSelector((state) => state.user.value);

  const [team, setTeam] = useState({});
  const {
    teamName,
    teamLeaderNickname,
    teamLeaderSeq,
    memberDtoList: members,
    projectType,
    teamGit,
  } = team;

  const [isSearch, setIsSearch] = useState(false);

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

  const setTeamNameHandler = (resTeamName) =>
    setTeam((prev) => {
      return { ...prev, teamName: resTeamName };
    });

  const openSearchInputHandler = () => setIsSearch(true);
  const closeSearchInputHandler = () => setIsSearch(false);
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
    dispatch(deleteMember(deleteData))
      .unwrap()
      .then(() => {
        dispatch(getTeam(teamSeq))
          .unwrap()
          .then((res) => setTeam(res))
          .catch(console.error);
      })
      .catch(console.error);
  };

  // Modal
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
    console.log("떴냐 모달?");
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#fff";
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <React.Fragment>
      <div className="flex flex-col">
        <Header />
        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-white font-bold"
              ref={(_subtitle) => (subtitle = _subtitle)}
            >
              Hello
            </h2>
            <IoClose
              className="cursor-pointer text-primary_dark ml-2"
              onClick={closeModal}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm mr-2">유저검색</div>
              <form onSubmit={submitSearchUserHandler}>
                <input
                  type="text"
                  name="searchUser"
                  id="searchUser"
                  onChange={searchUserChangeHandler}
                  value={searchUserName}
                  className="rounded-md bg-component_item_bg_+2_dark px-4 py-1 text-sm font-medium text-white text-left appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
                />
              </form>
            </div>
            <div>
              <div className="text-point_purple_op20 text-xs ml-14 mb-1">
                닉네임을 누르면 해당 유저가 팀에 추가됩니다.
              </div>
              {searchResults?.map((user) => (
                <div
                  key={user.userId}
                  className="hover:cursor-pointer px-4 py-1 text-sm font-bold ml-14 rounded-md text-point_yellow hover:bg-point_yellow_+2 hover:text-black"
                  onClick={() =>
                    addUserHandler(user.userSeq, user.userNickname)
                  }
                >
                  {user.userNickname}
                </div>
              ))}
            </div>
          </div>
        </Modal>
        {/* team detail */}
        <div className="flex items-center justify-center m-3 mb-6 w-screen h-screen overflow-auto">
          <div className="p-8 lg:w-4/5 w-fit h-fit flex flex-col justify-center border border-primary_-2_dark rounded-md">
            <TeamDetailHeader
              teamName={teamName}
              isLeader={teamLeaderSeq === mySeq}
              teamSeq={teamSeq}
              setTeamName={setTeamNameHandler}
            />

            {/* 팀장 */}
            <div className="flex items-center mb-2 md:w-full w-[285px] h-fit bg-component_item_bg_dark rounded-md">
              <div className="md:w-48 w-32 text-white font-bold bg-point_purple_op20 h-full p-2 flex items-center rounded-bl-md rounded-tl-md">
                팀장
              </div>
              <Member
                isLeader={true}
                teamLeaderNickname={teamLeaderNickname}
                onDelete={deleteMemberHandler}
              />
            </div>

            {/* 팀원 */}
            <div className="flex mb-2 md:w-full w-[285px] bg-component_item_bg_dark rounded-md">
              <div className="md:w-48 w-32 text-white font-bold bg-point_purple_op20 p-2 flex items-center rounded-bl-md rounded-tl-md">
                팀원
              </div>
              <div className="flex md:flex-row flex-col items-center">
                {members?.map((member) => (
                  <Member
                    key={`m${member.memberSeq}`}
                    isLeader={false}
                    member={member}
                    onDelete={deleteMemberHandler}
                  />
                ))}

                <div className="flex flex-col items-center px-2 md:py-2 pb-2">
                  {/* isSearch가 아니면 + 버튼, isSearch이면 유저 검색 입력창 나옴 */}
                  {!isSearch ? (
                    <IoAdd
                      className="text-white cursor-pointer"
                      // onClick={openSearchInputHandler}
                      onClick={openModal}
                    />
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
                      <IoClose
                        className="cursor-pointer text-primary_dark ml-2"
                        onClick={closeSearchInputHandler}
                      />

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

            {/* 팀 깃 주소 */}
            <div className="flex items-center mb-2 md:w-full w-[285px] h-fit bg-component_item_bg_dark rounded-md">
              <div className="md:w-48 w-32 text-white font-bold bg-point_purple_op20 h-full p-2 flex items-center rounded-bl-md rounded-tl-md">
                깃
              </div>
              <div className="flex">
                <div className="text-white text-sm p-2">
                  {teamGit ? teamGit : "-"}
                </div>
              </div>
            </div>

            {/* 프로젝트 타입 */}
            <div className="flex items-center md:w-full w-[285px] h-fit bg-component_item_bg_dark rounded-md">
              <div className="md:w-48 w-32 text-white font-bold bg-point_purple_op20 h-full p-2 flex items-center rounded-bl-md rounded-tl-md">
                프로젝트 타입
              </div>
              <div className="flex">
                <div className="text-white text-sm p-2">{projectType}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TeamDetail;
