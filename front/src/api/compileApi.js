import api from "./api";

const compileApi = {
  compilePython: (teamSeq, compileData) =>
    api.post(`/compile/py/${teamSeq}`, compileData),
  compilePythonStop: (projectData) => api.post("/compile/py/stop", projectData),
};

export default compileApi;
