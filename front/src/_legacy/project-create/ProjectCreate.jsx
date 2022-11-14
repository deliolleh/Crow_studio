import React from "react";

const ProjectCreate = () => {
  return (
    <div className="w-fit h-fit flex justify-center items-center border border-primary_-2_dark rounded-md mr-2">
      <div className="flex flex-col items-center">
        <div className="text-white text-4xl font-bold">프로젝트 생성하기</div>

        <div className="w-96">
          <label htmlFor="projectName" className="text-primary_dark text-sm">
            프로젝트 이름
          </label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            className="w-full text-white bg-component_item_bg_+1_dark py-2 px-3 placeholder:text-gray-300 placeholder:text-sm rounded-md transition"
            placeholder="프로젝트 이름을 입력하세요"
            required
          />
          <div className="h-6 mb-2">에러메시지</div>
        </div>

        <div className="w-96">
          <label
            htmlFor="selectedLanguage"
            className="text-primary_dark text-sm"
          >
            주로 사용할 언어
          </label>
          <input
            type="text"
            id="selectedLanguage"
            name="selectedLanguage"
            className="w-full text-white bg-component_item_bg_+1_dark py-2 px-3 rounded-md transition"
            required
          />
          <div className="h-6 mb-2">에러메시지</div>
        </div>

        <div className="w-96">
          <label
            htmlFor="selectedTemplate"
            className="text-primary_dark text-sm"
          >
            템플릿
          </label>
          <input
            type="text"
            id="selectedTemplate"
            name="selectedTemplate"
            className="w-full text-white bg-component_item_bg_+1_dark py-2 px-3 rounded-md transition"
            required
          />
          <div className="h-6 mb-2">에러메시지</div>
        </div>

        <button
          onClick
          className="w-72 h-12 text-xl font-bold bg-point_light_yellow text-component_dark hover:bg-point_yellow rounded-md transition"
        >
          생성하기
        </button>
      </div>
    </div>
  );
};

export default ProjectCreate;
