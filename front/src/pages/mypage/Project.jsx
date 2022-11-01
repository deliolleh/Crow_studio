import React from "react";

import Member from "./components/Member";

const Project = () => {
  return (
    <div className="w-fit h-96 px-8 flex flex-col justify-center border border-primary_-2_dark rounded-md">
      <div className="text-white text-xl font-bold">나의 프로젝트</div>
      <div className="text-point_light_yellow">금오</div>
      <div className="flex">
        <div className="w-32 h-56 pr-3 flex flex-col justify-around items-end bg-point_purple rounded-tl-2xl rounded-bl-2xl">
          <div className="text-white font-bold">팀장</div>
          <div className="text-white font-bold">팀원</div>
          <div className="text-white font-bold">프로젝트</div>
        </div>
        <div className="w-96 h-56 pl-5 flex flex-col justify-around items-start bg-component_item_bg_dark rounded-tr-2xl rounded-br-2xl">
          <div className="flex">
            <Member />
          </div>
          <div className="flex">
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
