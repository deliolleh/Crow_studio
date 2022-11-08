import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyNickname, modifyPassword } from "../../redux/userSlice";

import NicknameForm from "./components/NicknameForm";
import PasswordForm from "./components/PasswordForm";

const Modify = ({ closeModify }) => {
  const dispatch = useDispatch();
  const { myNickname } = useSelector((state) => state.user.value);

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

  return (
    <div className="w-fit h-96 px-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
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
    </div>
  );
};

export default Modify;
