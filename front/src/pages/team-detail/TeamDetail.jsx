import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTeam,
  addMember,
  deleteMember,
  modifyProjectType,
} from "../../redux/teamSlice";
import { searchUser } from "../../redux/userSlice";

import Header from "../../components/Header";
import TeamDetailHeader from "./components/TeamDetailHeader";

import Member from "./components/Member";

import Modal from "react-modal";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { IoAdd } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { BsPencilFill } from "react-icons/bs";
import { BsCheckLg } from "react-icons/bs";

// modal
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

// headlist listbox items
const pjtType = [
  { name: "pure Python" },
  { name: "Django" },
  { name: "Flask" },
  { name: "FastAPI" },
];

const TeamDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { teamSeq } = useParams();
  const mySeq = useSelector((state) => state.user.value.mySeq);

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
  const [projectTypeInput, setProjectTypeInput] = useState(false);
  const [modifiedProjectType, setModifiedProjectType] = useState(projectType);

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

  const goProjectHandler = () => navigate(`/project/${teamSeq}`);

  // modify project listbox
  const [selected, setSelected] = useState(pjtType[0]);

  const listboxChangeHandler = (e) => {
    setSelected(e);
    console.log(e);
    modifyProjectTypeHandler(e);
  };

  const modifyProjectTypeHandler = (e) => {
    // setModifiedProjectType(e.target.value);
    setModifiedProjectType(e.name);
    submitProjectTypeHandler(e);
  };

  const submitProjectTypeHandler = (e) => {
    // e.preventDefault();
    const modifiedData = { projectType: modifiedProjectType };
    dispatch(modifyProjectType({ teamSeq, modifiedData }))
      .unwrap()
      .then((res) => {
        console.log(res);
        setProjectTypeInput(false);
        dispatch(getTeam(teamSeq))
          .unwrap()
          .then((res) => {
            setTeam(res);
            console.log("res:", res);
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col h-full w-full">
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
              팀원 추가
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
                  className="rounded-md bg-component_item_bg_+2_dark px-4 py-1 text-sm font-medium text-white text-left appearance-none shadow-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark"
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
        <div className="flex items-center justify-center m-3 mb-6 h-screen overflow-auto">
          <div className="p-8 lg:w-4/5 w-fit max-w-[1000px] h-fit flex flex-col justify-center items-center border border-primary_-2_dark rounded-md">
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
              <div className="flex md:flex-row flex-col justify-center items-center">
                {members?.map((member) => (
                  <Member
                    key={`m${member.memberSeq}`}
                    isLeader={false}
                    member={member}
                    onDelete={deleteMemberHandler}
                  />
                ))}

                <div className="flex flex-col items-center px-2 py-2">
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
            <div className="flex mb-4 md:w-full w-[285px] bg-component_item_bg_dark rounded-md">
              <div className="md:w-48 w-32 text-white font-bold bg-point_purple_op20 p-2 flex items-center rounded-bl-md rounded-tl-md">
                프로젝트 타입
              </div>
              <div className="flex">
                <div className="text-white text-sm p-2">
                  {!projectTypeInput && (
                    <div className="flex items-center">
                      <span>{projectType}</span>
                      <BsPencilFill
                        className="ml-3 text-sm text-point_yellow_+2 cursor-pointer"
                        onClick={() => setProjectTypeInput(true)}
                      />
                    </div>
                  )}
                  {projectTypeInput && (
                    <div className="w-full flex justify-start">
                      <div className="md:w-72 w-[115px]">
                        <Listbox
                          name="projectType"
                          value={selected}
                          // onChange={setSelected}
                          onChange={listboxChangeHandler}
                        >
                          <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-component_item_bg_+2_dark text-white py-2 pl-3 pr-10 text-left shadow-md active:outline-none active:ring-2 active:ring-point_purple focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple">
                              <span className="block truncate">
                                {selected.name}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-point_purple"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-component_item_bg_+2_dark text-white py-1 text-base shadow-lg focus:outline-none">
                                {pjtType.map((type, typeIdx) => (
                                  <Listbox.Option
                                    key={typeIdx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-1.5 pl-10 pr-4 ${
                                        active ? "bg-point_purple_op20" : ""
                                      }`
                                    }
                                    value={type}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {type.name}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-point_purple">
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                      <button
                        className="ml-2"
                        onClick={submitProjectTypeHandler}
                      >
                        <BsCheckLg className="text-point_light_yellow hover:text-point_yellow" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 프로젝트 이동 버튼 */}
            <button
              onClick={goProjectHandler}
              className="w-72 h-12 text-lg font-bold bg-point_light_yellow text-component_dark hover:bg-point_yellow rounded-md transition"
            >
              프로젝트로 이동
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TeamDetail;
