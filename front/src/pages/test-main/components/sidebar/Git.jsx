import React, { useState, useEffect } from "react";
import styled from "styled-components";
import gitApi from "../../../../api/gitApi";
import { BsCircleFill } from "react-icons/bs";

// styled
const GitContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;

const Git = (
  teamSeq = 12
  // propAddress = "/home/ubuntu/crow_data/12/Medici_study/Medici_study/.git/objects/90"
) => {
  const [repoBranch, setRepoBranch] = useState([]);
  const [localBranch, setLocalBranch] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [callBell, setCallBell] = useState(0);
  const nowAddress = "/home/ubuntu/crow_data/12/Medici_study/Medici_study/";
  const nowBranch = "";
  // const seq = useSelector((state) => state.user.value.mySeq);
  const seq = 4;

  useEffect(() => {
    // console.log(nowAddress);
    const body = {
      gitPath: nowAddress,
    };
    gitApi.gitBranch(2, body).then((res) => {
      // console.log("repo: ", res.data);
      setRepoBranch(() => res.data);
    });
    gitApi.gitBranch(1, body).then((res) => {
      // console.log("local: ", res.data);
      setLocalBranch(() => res.data);
    });
  }, [nowAddress, callBell]);

  const changeCommit = (e) => {
    setCommitMessage(() => e.target.value);
  };

  const changeBranch = (event) => {
    const ChangingBranch = event.target.textContent;
    console.log("click: ", ChangingBranch);
    const pureBranch = ChangingBranch.split(" ")[0].replaceAll("origin/", "");
    console.log(pureBranch);
    const gitData = {
      gitPath: nowAddress,
      branchName: pureBranch,
    };
    gitApi
      .gitSwitch(1, gitData)
      .then(() => {
        console.log("깃 스위치에 성공했습니다");
        setCallBell((prev) => prev + 1);
      })
      .catch((err) => console.error(err));
  };

  const onChangeName = (e) => {
    setNewBranchName(e.target.value);
  };

  const newBranch = () => {
    console.log("new branch: ", newBranchName);
    const gitData = {
      gitPath: nowAddress,
      branchName: newBranchName,
    };
    gitApi
      .gitSwitch(2, gitData)
      .then(() => {
        console.log("새로운 브랜치를 생성했습니다.");
        setCallBell((prev) => prev + 1);
      })
      .catch((err) => console.error(err));
    setNewBranchName("");
  };

  const justCommit = () => {
    const body = {
      message: commitMessage,
      gitPath: nowAddress,
      filePath: "all",
    };
    gitApi.gitCommit(body).then((res) => {
      console.log(res.data);
    });
  };

  const commitAndPush = () => {
    const body = {
      message: commitMessage,
      gitPath: nowAddress,
      filePath: "all",
      branchName: nowBranch,
    };
    gitApi.gitPush(seq, body).then((res) => {
      console.log(res.data);
    });
  };

  return (
    <>
      <GitContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div
          className="flex justify-between items-center"
          style={{ padding: 15 }}
        >
          <div className="text-xl font-bold text-white my-1">Git</div>
        </div>
        <hr className="bg-component_dark border-0 m-0 h-[3px] min-h-[3px]" />
        <div className="p-[15px] overflow-auto">
          <div className="pl-1">
            <div className="text-primary_dark text-sm font-bold">
              <div>
                <div className="w-fit mb-5">
                  <div className="mb-2">Commit/Push</div>
                  <textarea
                    value={commitMessage}
                    style={{ resize: "none" }}
                    onChange={changeCommit}
                    cols="25"
                    rows="6"
                    className="rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-sm font-medium text-white text-left appearance-none shadow-xs focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark mb-2"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      onClick={justCommit}
                      className="h-[26px] w-[70px] rounded-md bg-point_purple text-white mr-2"
                    >
                      Commit
                    </button>
                    <button
                      onClick={commitAndPush}
                      className="h-[26px] w-[110px] rounded-md bg-point_purple text-white"
                    >
                      Commit&Push
                    </button>
                  </div>
                </div>
                <hr className="bg-component_+2_dark border-0 m-0 h-[1px] min-h-[1px] w-[253px] mb-5" />
                <details open className="mb-5 w-fit">
                  <summary className="font-bold mb-2">새로운 브랜치</summary>
                  <div className="flex">
                    <input
                      type="text"
                      onChange={onChangeName}
                      value={newBranchName}
                      className="h-[28px] w-[180px] rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-sm font-medium text-white text-left break-all appearance-none shadow-xs focus:border-none focus:outline-none focus:ring-2 focus:ring-point_purple placeholder:text-primary_dark mb-2"
                    />
                    <button
                      onClick={newBranch}
                      className="h-[26px] w-[45px] rounded-md bg-point_purple text-white ml-2"
                    >
                      생성
                    </button>
                  </div>
                </details>
                <hr className="bg-component_+2_dark border-0 m-0 h-[1px] min-h-[1px] w-[253px] mb-5" />
                <details open className="mb-5 w-fit">
                  <summary className="mb-2">Local Branch</summary>
                  {localBranch.map((branch, index) => {
                    return (
                      <div
                        key={"local " + index}
                        onClick={(e) => changeBranch(e)}
                        className="flex items-center w-[233px] h-[26px] rounded-md hover:bg-point_purple_op20"
                      >
                        <BsCircleFill
                          size={"0.5rem"}
                          className={
                            "text-point_purple ml-4 mr-3" +
                            (branch.includes("*") === true
                              ? ""
                              : " text-transparent")
                          }
                        />
                        <div className="text-white font-normal">
                          {branch.includes("*") === true
                            ? branch.replace("*", "")
                            : branch}
                        </div>
                      </div>
                    );
                  })}
                </details>
                <hr className="bg-component_+2_dark border-0 m-0 h-[1px] min-h-[1px] w-[253px] mb-5" />
                <details className="mb-5 w-fit">
                  <summary className="mb-2">Repo Branch</summary>
                  {repoBranch.map((branch, index) => {
                    return (
                      <div
                        key={"repo " + index}
                        onClick={(e) => changeBranch(e)}
                        className="flex items-center w-[233px] h-[26px] rounded-md hover:bg-point_purple_op20 overflow-x-auto"
                      >
                        <BsCircleFill
                          size={"0.5rem"}
                          className={
                            "text-point_purple  ml-4 mr-3" +
                            (branch.includes("*") === true
                              ? ""
                              : " text-transparent")
                          }
                        />
                        <div className="text-white font-normal">{branch}</div>
                      </div>
                    );
                  })}
                </details>
              </div>
            </div>
          </div>
        </div>
      </GitContainer>
    </>
  );
};

export default Git;
