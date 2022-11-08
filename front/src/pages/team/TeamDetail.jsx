import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getTeam, modifyTeamName, deleteTeam } from "../../redux/teamSlice";

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

  useEffect(() => {
    dispatch(getTeam(teamSeq))
      .unwrap()
      .then((res) => {
        setTeam(res);
        console.log("res:", res);
      })
      .catch(console.error);
  }, []);

  const clickTeamListHandler = () => {
    navigate("/teams");
  };

  //
  const inputTeamNameChangeHandler = (e) => setInputTeamName(e.target.value);

  const submitTeamNameChange = (e) => {
    e.preventDefault();
    console.log("inputTeamName:", inputTeamName);
    dispatch(modifyTeamName({ teamName: inputTeamName, teamSeq }))
      .unwrap()
      .then((res) =>
        setTeam((prev) => {
          return { ...prev, teamName: res };
        })
      )
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

  //
  // const submitHandler = (e) => {
  //   e.preventDefault();

  //   let isInvalid = false;
  //   setErrorMsgs(initialErrorState);
  //   if (teamName.trim().length === 0) {
  //     setErrorMsgs((prev) => {
  //       return { ...prev, teamNameErrMsg: "팀 이름을 입력하세요" };
  //     });
  //     isInvalid = true;
  //   }
  //   if (teamName.trim() === "400" || teamName.trim() === "403") {
  //     setErrorMsgs((prev) => {
  //       return { ...prev, teamNameErrMsg: "사용할 수 없는 팀 이름입니다" };
  //     });
  //     isInvalid = true;
  //   }
  //   if (isInvalid) {
  //     return;
  //   }

  //   const teamNameData = { teamName };
  //   setErrorMsgs(initialErrorState);
  //   dispatch(createTeam(JSON.stringify(teamNameData)))
  //     .unwrap()
  //     .then((res) => {
  //       alert("팀 생성 완료");
  //       navigate("/team", { replace: true });
  //       console.log("res:", res);
  //     })
  //     .catch((errorStatusCode) => {
  //       if (errorStatusCode === 409) {
  //         alert("이미 해당 이름으로 팀을 생성했습니다");
  //       } else {
  //         alert("비상!!");
  //       }
  //     });
  // };

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

      <button onClick={deleteTeamHandler}>팀 삭제</button>

      <br />

      <button onClick={clickTeamListHandler}>팀 목록</button>
    </div>
  );
};

export default TeamDetail;
