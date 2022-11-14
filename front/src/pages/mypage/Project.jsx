import React from "react";

import Member from "./components/Member";

const Project = () => {
  return (
    <div className="md:w-fit sm:w-[600px] w-[400px] h-96 px-11 flex flex-col justify-center border border-primary_-2_dark rounded-md">
      <div className="text-white text-xl font-bold mb-1">나의 프로젝트</div>
      <div className="text-point_light_yellow mb-2">금오</div>
      <div className="flex">
        <div className="lg:w-32 md:w-auto sm:w-32 w-auto min-w-[100px] h-56 pr-3 flex flex-col justify-between items-end bg-point_purple rounded-tl-2xl rounded-bl-2xl px-2">
          <div className="text-white font-bold mt-10">팀장</div>
          <div className="text-white font-bold mt-6">팀원</div>
          <div className="text-white font-bold mb-3">프로젝트</div>
        </div>
        <div className="lg:w-96 md:w-[235px] sm:w-96 w-[235px] h-56 pl-5 flex flex-col justify-around items-start bg-component_item_bg_dark rounded-tr-2xl rounded-br-2xl">
          <div className="flex">
            <Member />
          </div>
          <div className="flex lg:w-auto md:w-[195px] sm:w-auto w-[195px] overflow-x-auto">
            <Member />
            <Member />
            <Member />
            <Member />
            <Member />
          </div>
          <div className="text-point_light_yellow">/까마귀공방</div>
        </div>
      </div>
    </div>
  );
};

export default Project;
