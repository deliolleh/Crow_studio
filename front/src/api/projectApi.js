import api from "./api";

// const projectApi = {
//   directoryList: (teamSeq) => api.get(`/projects/${teamSeq}`),
//   projectCreate: (teamSeq, type, projectName) =>
//     api.post(`/projects/${teamSeq}?type=${type}`, projectName),
//   projectDelete: (projectData) =>
//     api.post("/projects/projectDeleter", projectData),
// };

const projectApi = {
  directoryList: (directoryData) =>
    api.post("/projects/directories/", directoryData),
};

export default projectApi;
