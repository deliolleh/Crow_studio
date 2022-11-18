import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goHomeHandler = () => navigate("/", { replace: true });

  return (
    <div className="flex flex-col">
      <div className="flex flex-col h-screen justify-center justify-items-center items-center overflow-auto">
        <div className="text-center">logo</div>
        <div className="text-7xl font-bold text-center text-white mt-5">
          까마귀공방
        </div>
        <div className="text-center text-white flex-col mt-11">
          <div className="text-4xl">404 Not Found</div>
        </div>
        <button
          onClick={goHomeHandler}
          className="w-72 h-12 mt-14 text-xl font-bold bg-point_light_yellow text-component_dark hover:bg-point_yellow rounded-md transition"
        >
          메인 페이지로
        </button>
      </div>
    </div>
  );
};

export default NotFound;
