import React, { useState, useEffect } from "react";
import styled from "styled-components";
import gitApi from "../../../../api/gitApi";
import { BsCircleFill } from "react-icons/bs";

// styled
const GitContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100%;
`;

const Git = (props) => {
  const [repoBranch, setRepoBranch] = useState([]);
  const [localBranch, setLocalBranch] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [callBell, setCallBell] = useState(0);
  const [nowBranch, setNowBranch] = useState("");
  const { selectedFilePath, teamSeq, mySeq } = props;
  // const seq = useSelector((state) => state.user.value.mySeq);

  useEffect(() => {
    const body = {
      gitPath: selectedFilePath,
    };
    gitApi.gitBranch(teamSeq, 2, body).then((res) => {
      // console.log("repo: ", res.data);
      setRepoBranch(() => res.data);
    });
    gitApi.gitBranch(teamSeq, 1, body).then((res) => {
      // console.log("local: ", res.data);
      setLocalBranch(() => res.data);
    });
  }, [callBell]);

  const changeCommit = (e) => {
    setCommitMessage(() => e.target.value);
  };

  const changeBranch = (event) => {
    const ChangingBranch = event.target.textContent;
    const pureBranch = ChangingBranch.replaceAll(" ", "").replace(
      "origin/",
      ""
    );
    // console.log("click: ", pureBranch);
    const gitData = {
      branchName: pureBranch,
    };
    // console.log(gitData);
    gitApi
      .gitSwitch(teamSeq, 1, gitData)
      .then(() => {
        console.log("깃 스위치에 성공했습니다");
        setCallBell((prev) => prev + 1);
        setNowBranch(() => pureBranch);
      })
      .catch((err) => console.error(err));
  };

  const onChangeName = (e) => {
    setNewBranchName(e.target.value);
  };

  const newBranch = () => {
    console.log("new branch: ", newBranchName);
    const gitData = {
      branchName: newBranchName,
    };
    gitApi
      .gitSwitch(teamSeq, 2, gitData)
      .then(() => {
        console.log("새로운 브랜치를 생성했습니다.");
        setCallBell((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
        alert("잘못된 이름입니다.");
      });
    setNewBranchName("");
  };

  const justCommit = async () => {
    const body = {
      message: commitMessage,
      // gitPath: selectedFilePath,
      filePath: "all",
    };
    // console.log(body);
    try {
      const res = await gitApi.gitCommit(teamSeq, body);
      // console.log(res);
      setCommitMessage(() => "");
    } catch (err) {
      console.log(err);
    }
  };

  const commitAndPush = () => {
    const body = {
      message: commitMessage,
      teamSeq: teamSeq,
      filePath: "all",
      branchName: nowBranch,
    };
    gitApi
      .gitPush(mySeq, body)
      .then((res) => {
        console.log(res.data);
        setCommitMessage("");
      })
      .catch((err) => console.error(err));
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
                      className="h-[26px] w-[70px] rounded-md bg-point_purple hover:bg-point_purple_-2 text-white mr-2"
                    >
                      Commit
                    </button>
                    <button
                      onClick={commitAndPush}
                      className="h-[26px] w-[110px] rounded-md bg-point_purple hover:bg-point_purple_-2 text-white"
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
                      className="h-[26px] w-[45px] rounded-md bg-point_purple hover:bg-point_purple_-2 text-white ml-2"
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
