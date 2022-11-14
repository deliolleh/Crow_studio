import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  modifyNickname,
  modifyPassword,
  resign,
  updateGitAuth,
  getUser,
} from "../../redux/userSlice";

import NicknameForm from "./components/NicknameForm";
import PasswordForm from "./components/PasswordForm";
import ResignForm from "./components/ResignForm";
import GitForm from "./components/GitForm";
import { useEffect } from "react";

const Modify = ({ closeModify }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myNickname } = useSelector((state) => state.user.value);

  // useEffect(() => {
  //   dispatch(getUser()).unwrap().then(console.log);
  // }, []);

  const closeModifyHandler = () => closeModify(false);

  const submitNicknameHandler = (nicknameData) =>
    dispatch(modifyNickname(nicknameData)).unwrap().catch(console.error);

  const submitPasswordHandler = (passwordData) => {
    dispatch(modifyPassword(passwordData))
      .unwrap()
      .catch((errorStatusCode) => {
        if (errorStatusCode === 409) {
          alert("현재 비밀번호가 틀립니다");
        } else {
          alert("비상!!");
        }
      });
  };

  const resignHandler = () => {
    if (!window.confirm("진짜 갈거임??")) {
      return;
    }
    dispatch(resign())
      .unwrap()
      .then((res) => {
        console.log("resign res:", res);
        alert("회원 탈퇴 완료");
        navigate("/");
      })
      .catch((errorStatusCode) => {
        if (errorStatusCode === 403) {
          console.error(errorStatusCode);
          alert("팀장으로 있는 동안은 탈퇴할 수 없습니다");
        } else {
          alert("비상!!");
        }
      });
  };

  const updateGitAuthHandler = (credentialsData) => {
    dispatch(updateGitAuth(credentialsData))
      .unwrap()
      .then((res) => {
        console.log("res:", res);
        alert("깃 연결 성공");
      })
      .catch(console.error);
  };

  return (
    <div className="container p-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
      <div className="flex justify-between">
        <div className="text-white text-xl font-bold">내 정보 수정하기</div>
        <button
          className="text-white text-xl font-bold cursor-pointer"
          onClick={closeModifyHandler}
        >
          X
        </button>
      </div>

      <NicknameForm
        onSubmitNickname={submitNicknameHandler}
        initialNickname={myNickname}
      />

      <PasswordForm onSubmitPassword={submitPasswordHandler} />

      <GitForm updateGitAuth={updateGitAuthHandler} />

      <ResignForm onResign={resignHandler} />
    </div>
  );
};

export default Modify;
