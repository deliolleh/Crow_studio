import api from "./api";

const gitApi = {
  gitClone: (teamSeq) => api.post(`/git/${teamSeq}`),
  gitSwitch: (type, gitData) =>
    api.post(`/git/git-switch?type=${type}`, gitData),
  gitBranch: (type) => api.post(`/git/branches?type=${type}`),
  gitCommit: (commitData) => api.post("/git/git-commit", commitData),
};

export default gitApi;
