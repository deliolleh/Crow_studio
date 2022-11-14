import React from "react";

const ResignForm = ({ onResign }) => {
  const submitHandler = () => {
    onResign();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="submit"
        className="w-full text-lg font-bold text-component_dark bg-point_pink hover:bg-point_red hover:text-white py-2 px-6 rounded-md transition"
        onClick={submitHandler}
      >
        탈퇴하기
      </button>
    </div>
  );
};

export default ResignForm;