import api from "./api";

const gitApi = {
  gitClone: (teamSeq) => api.post(`/git/${teamSeq}`),
  gitSwitch: (type, gitData) =>
    api.post(`/git/git-switch?type=${type}`, gitData),
  gitBranch: (type, gitData) => api.post(`/git/branches?type=${type}`, gitData),
  gitCommit: (commitData) => api.post("/git/git-commit", commitData),
  gitPush: (userSeq, pushData) =>
    api.post(`/git/${userSeq}/git-push`, pushData),
};

export default gitApi;
