import React from "react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();

  const clickButtonHandler = () => navigate("/project/create");

  return (
    // <div className="flex flex-col justify-items-center items-center mt-60">
    <div className="flex flex-col h-screen justify-center justify-items-center items-center">
      <div className="">logo</div>
      <div className="text-7xl font-bold text-white mt-5">까마귀공방</div>
      <div className="text-center text-white flex-col mt-11">
        <div className="text-4xl">무언가 굉장하고 엄청난</div>
        <div className="text-4xl">웹IDE계의 이단아가 등장했다</div>
        <div className="text-4xl">다들 사용해달라 지금 당장!!</div>
      </div>
      <button
        onClick={clickButtonHandler}
        className="w-72 h-12 mt-14 text-xl font-bold bg-point_light_yellow text-component_dark hover:bg-point_yellow rounded-md transition"
      >
        프로젝트 생성하기
      </button>
    </div>
  );
};

export default Intro;
