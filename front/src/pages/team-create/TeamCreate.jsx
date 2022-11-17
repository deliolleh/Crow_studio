import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import { createTeam } from "../../redux/teamSlice";

import Header from "../../components/Header";

const initialInputState = {
  teamName: "",
  projectType: "pure Python",
  projectGit: "",
};
const initialErrorState = {
  teamNameErrMsg: "",
  projectGitErrMsg: "",
};

// headlist listbox items
const pjtType = [
  { name: 'pure Python' },
  { name: 'Django' },
  { name: 'Flask' },
  { name: 'FastAPI' },
]

const TeamCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(initialInputState);
  const [errorMsgs, setErrorMsgs] = useState(initialErrorState);
  const { teamName, projectType, projectGit } = inputs;
  const { teamNameErrMsg, projectGitErrMsg } = errorMsgs;
  const [checkGit, setCheckGit] = useState(false);

  const inputChangeHandler = (e) => {
    if (e.name) {
      setInputs((prev) => {
        return { ...prev, projectType: e.name };
      });
    } else {
      if (e.target.name === "teamName") {
        setInputs((prev) => {
          return { ...prev, teamName: e.target.value };
        });
      // } else if (e.target.name === "projectType") {
      //   setInputs((prev) => {
      //     return { ...prev, projectType: e.target.value };
      //   });
      } else if (e.target.name === "projectGit") {
        setInputs((prev) => {
          return { ...prev, projectGit: e.target.value };
        });
      } else if (e.target.name === "checkGit") {
        setCheckGit((prev) => !prev);
      }
    };

  };

  const submitHandler = (e) => {
    e.preventDefault();
    let isInvalid = false;
    setErrorMsgs(initialErrorState);
    if (teamName.trim().length === 0) {
      setErrorMsgs((prev) => {
        return { ...prev, teamNameErrMsg: "팀 이름을 입력하세요" };
      });
      isInvalid = true;
    }
    if (teamName.trim() === "400" || teamName.trim() === "403") {
      setErrorMsgs((prev) => {
        return { ...prev, teamNameErrMsg: "사용할 수 없는 팀 이름입니다" };
      });
      isInvalid = true;
    }
    if (checkGit) {
      if (projectGit.trim().length === 0) {
        setErrorMsgs((prev) => {
          return { ...prev, projectGitErrMsg: "프로젝트 깃 주소를 입력하세요" };
        });
        isInvalid = true;
      }
    }
    if (isInvalid) {
      return;
    }

    console.log(teamName, projectType, projectGit);

    const teamData = { teamName, projectType, projectGit: projectGit ?? "" };
    setErrorMsgs(initialErrorState);
    dispatch(createTeam(teamData))
      .unwrap()
      .then(() => {
        alert("팀 생성 완료");
        navigate("/teams", { replace: true });
      })
      .catch((errorStatusCode) => {
        if (errorStatusCode === 409) {
          alert("이미 해당 이름으로 생성된 팀이 있습니다");
        } else if (errorStatusCode === 404) {
          alert("해당 깃 주소가 유효하지 않습니다");
        } else {
          alert("비상!!");
        }
      });
  };

  const goTeamListHandler = () => navigate("/teams");

  // listbox
  const [selected, setSelected] = useState(pjtType[0])

  const listboxChangeHandler =(e) => {
    setSelected(e);
    console.log(e)
    inputChangeHandler(e);
  }

  return (
    <div className="flex flex-col">
      <Header />
      <div className="h-screen flex justify-center items-center mb-2">
        <div className="px-16 py-12 flex flex-col w-fit h-fit justify-center items-center border border-primary_-2_dark rounded-md">
          <div className="text-4xl font-bold text-white pb-2 mb-5">
            팀 생성하기
          </div>
          <form
            method="post"
            onSubmit={submitHandler}
            className="flex flex-col items-center"
          >
            {/* 팀 이름 */}
            <div className="w-80 mb-1">
              <label htmlFor="teamName" className="">
                팀 이름
              </label>
              <input
                type="teamName"
                id="teamName"
                name="teamName"
                className="mt-1 w-full text-white bg-component_item_bg_+2_dark transition:bg-component_item_bg_+2_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple rounded-md transition"
                placeholder="팀 이름을 입력하세요"
                required
                value={teamName}
                onChange={inputChangeHandler}
              />
              <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
                {teamNameErrMsg}
              </div>
            </div>

            {/* 프로젝트 종류 */}
            <div className="w-80 mb-7">
              {/* headlessui Listbox */}
              <div className="w-80">
                <Listbox
                  name="projectType"
                  value={selected}
                  // onChange={setSelected}
                  onChange={listboxChangeHandler}
                >
                  <div className="relative mt-1">
                    <Listbox.Label>
                      프로젝트 종류
                    </Listbox.Label>
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-component_item_bg_+2_dark text-white py-2 pl-3 pr-10 text-left shadow-md active:outline-none active:ring-2 active:ring-point_purple focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple">
                      <span className="block truncate">{selected.name}</span>
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
                                active ? 'bg-point_purple_op20' : ''
                              }`
                            }
                            value={type}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {type.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-point_purple">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
            </div>

            {/* 프로젝트 깃 주소 */}
            <div className="w-80 mb-4">
              {/* 체크박스 */}
              <input
                type="checkbox"
                id="checkGit"
                name="checkGit"
                className="bg-component_item_bg_+2_dark hover:bg-point_purple_op20 cursor-pointer border-3 border-primary-dark rounded checked:bg-point_purple text-point_purple focus:ring-0 mr-2"
                defaultValue={checkGit}
                onChange={inputChangeHandler}
              />
              <label htmlFor="projectGit" className="">
                프로젝트 깃 주소
              </label>
              <input
                type="text"
                id="projectGit"
                name="projectGit"
                className="mt-1 w-full text-white py-2 px-3 bg-component_item_bg_+2_dark placeholder:text-gray-300 placeholder:text-sm active:outline-none active:ring-2 active:ring-point_purple focus:outline-none focus:ring-2 focus:ring-point_purple focus:border-none rounded-md transition"
                placeholder="프로젝트 깃 주소를 입력하세요"
                disabled={!checkGit}
                value={projectGit}
                onChange={inputChangeHandler}
              />
              <div className="h-6 mt-1 ml-3 mb-0.5 text-sm text-point_pink">
                {projectGitErrMsg}
              </div>
            </div>

            {/* 팀 생성 버튼 */}
            <button
              type="submit"
              className="w-80 text-lg font-bold text-component_dark bg-point_light_yellow hover:bg-point_yellow py-2 px-6 rounded-md transition mb-2"
              onClick={submitHandler}
            >
              팀 생성
            </button>
          </form>
          <button
            onClick={goTeamListHandler}
            className="w-80 px-10 py-2 text-primary_dark bg-component_item_bg_dark border border-primary_-2_dark rounded-md"
          >
            팀 목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCreate;
