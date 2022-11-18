import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { updateNickname, resign, updateGitAuth } from "../../redux/userSlice";

import userApi from "../../api/userApi";

import NicknameForm from "./components/NicknameForm";
import PasswordForm from "./components/PasswordForm";
import ResignForm from "./components/ResignForm";
import GitForm from "./components/GitForm";

import { IoClose } from "react-icons/io5";

const Modify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myNickname = useSelector((state) => state.user.value.myNickname);

  const updateNicknameHandler = (nicknameData) =>
    dispatch(updateNickname(nicknameData)).unwrap().catch(console.error);

  const submitPasswordHandler = (passwordData) => {
    userApi
      .updatePassword(passwordData)
      .then(alert("비밀번호를 성공적으로 변경했습니다"))
      .catch((errorStatusCode) => {
        if (errorStatusCode === 409) {
          alert("현재 비밀번호가 틀립니다");
        } else {
          alert("비상!!");
        }
      });
  };

  const resignHandler = () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까?")) {
      return;
    }
    dispatch(resign())
      .unwrap()
      .then(() => {
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
    <div
      className="lg:w-[700px] md:w-[400px] sm:w-[600px] w-[400px] p-8 flex flex-col border border-primary_-2_dark rounded-md overflow-auto"
      style={{ height: "calc(100% - 80px)" }}
    >
      <div className="flex mb-5 justify-between items-center">
        <div className="text-white text-xl font-bold">내 정보 수정하기</div>
        <IoClose className="text-white text-xl font-bold cursor-pointer mt-1" />
      </div>
      <NicknameForm
        updateNickname={updateNicknameHandler}
        initialNickname={myNickname}
      />
      <hr className="border-primary_-2_dark mb-5" />
      <PasswordForm updatePassword={submitPasswordHandler} />
      <hr className="border-primary_-2_dark mb-5" />
      <GitForm updateGitAuth={updateGitAuthHandler} />
      <ResignForm resign={resignHandler} />
    </div>
  );
};

export default Modify;
