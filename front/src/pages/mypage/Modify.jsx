import React from "react";

const Modify = ({ closeModify }) => {
  const clickModifyClose = () => closeModify(false);

  return (
    <div className="w-fit h-96 px-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
      <div className="flex justify-between">
        <div className="text-white text-xl font-bold">내 정보 수정하기</div>
        <button
          className="text-white text-xl font-bold cursor-pointer"
          onClick={clickModifyClose}
        >
          X
        </button>
      </div>

      <div className="w-96 mb-6">
        <div className="text-primary_dark text-sm">프로필 사진</div>
        <div className="w-20 h-20 bg-point_purple rounded-full"></div>
      </div>

      <div className="w-96">
        <label htmlFor="nickname" className="text-primary_dark text-sm">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          className="w-full text-white bg-component_item_bg_+1_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="닉네임을 입력하세요"
          required
        />
        <div className="h-6 mb-2">에러메시지</div>
      </div>

      <div className="w-96">
        <label htmlFor="status" className="text-primary_dark text-sm">
          상태 메시지
        </label>
        <input
          type="text"
          id="status"
          name="status"
          className="w-full text-white bg-component_item_bg_+1_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
          placeholder="상태 메시지를 입력하세요"
          required
        />
        <div className="h-6 mb-2">{}</div>
      </div>
    </div>
  );
};

export default Modify;
