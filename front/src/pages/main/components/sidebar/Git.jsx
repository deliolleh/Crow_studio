import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import gitApi from "../../../../api/gitApi";

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
        <div style={{ padding: 15 }}>
          <div className="pl-1">
            <div className="text-primary_dark text-sm font-bold">
              <div>
                <div>
                  <div>Repo Branch</div>
                  {repoBranch.map((branch, index) => {
                    return (
                      <div
                        key={"repo " + index}
                        onClick={(e) => changeBranch(e)}
                      >
                        {branch}
                      </div>
                    );
                  })}
                  <br />
                  <div>Local Branch</div>
                  {localBranch.map((branch, index) => {
                    return (
                      <div
                        key={"local " + index}
                        onClick={(e) => changeBranch(e)}
                      >
                        {branch}
                      </div>
                    );
                  })}
                </div>
                <br />
                <div>
                  <div>새로운 브랜치 만들기</div>
                  <input
                    type="text"
                    onChange={onChangeName}
                    value={newBranchName}
                  />
                  <button onClick={newBranch}>make New Branch</button>
                </div>
                <br />
                <div>
                  <div>Commit/Push</div>
                  <textarea
                    value={commitMessage}
                    style={{ resize: "none" }}
                    onChange={changeCommit}
                    cols="10"
                    rows="5"
                  ></textarea>
                  <div>
                    <button onClick={justCommit}>Commit</button>
                    <button onClick={commitAndPush}>Commit&Push</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GitContainer>
    </>
  );
};

export default Git;
